const smsEvents = require('../eventBus');
const { Medicine } = require('../Models/medicine');
const { Vendor } = require('../Models/vendor');

// OTP generator
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

// OTP storage
const otpStorage = {};

// Function to fetch medicines from the database and check availability
const checkMedicineAvailability = async (req, res) => {
    try {
        // Format of data = { medicines: [{name: name, quantity: qty}, {name: name, quantity: qty}, ...], recepient: recepient }
        const{ medicines, recipient } = req.body; // Extract medicines from the request

        if (!medicines || !recipient) {
            console.log("Medicines and recipient are not provided");

            return res.status(400).json({ success: false, error: "Medicines and recipient are required" });
        }

        const unavailableItems = [];

        for (const item of medicines) {
            const medicine = await Medicine.findOne({ name: item.name });

            if (!medicine || medicine.quantity < item.quantity) {
                unavailableItems.push(item.name);
            }
        }

        if (unavailableItems.length > 0) {
            console.log("Insufficient stock for: ", unavailableItems.join(", "));

            return res.status(400).json({ success: false, error: `Insufficient stock for: ${unavailableItems.join(", ")}` });
        }

        console.log("All medicines are available");

        // Generate OTP
        const otp = generateOTP();
        otpStorage[recipient] = { otp: otp, tries: 3 };
        console.log(`OTP generated for ${recipient}: ${otp}`);

        // Send SMS
        smsEvents.emit("sendSMS", { content: `Your OTP is ${otp}`, to: recipient });

        res.status(200).json({ success: true, message: "OTP sent to recipient" });
    }
    catch (error) {
        console.log(`An error occurred: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { vendorname, recipient, otp, medicines } = req.body;

        console.log("Received request to verify OTP. Processing...");

        if (!recipient || !otp || !medicines) {
            console.log("Recipient, OTP, and medicines are required");

            return res.status(400).json({ success: false, error: "Recipient, OTP, and medicines are required fields" });
        }

        if (!otpStorage[recipient]) {
            console.log("Invalid or expired OTP");

            return res.status(400).json({ success: false, error: "Invalid or expired OTP" });
        }

        if (otpStorage[recipient].otp != otp) { // Check if OTP is valid
            otpStorage[recipient].tries--;

            if (otpStorage[recipient].tries == 0) {
                const vendor = await Vendor.findOne({ username: vendorname });
                lodgeComplaint({ recipient: recipient, medicines: medicines, id: vendor._id}); // Lodge a complaint against the vendor
                delete otpStorage[recipient];
                console.log("Invalid OTP. Maximum tries exceeded");

                return res.status(400).json({ success: false, error: "Invalid OTP. Maximum tries exceeded" });
            }

            console.log("Invalid OTP. Remaining tries: ", otpStorage[recipient].tries);

            return res.status(400).json({ success: false, error: `Invalid OTP. Remaining tries: ${otpStorage[recipient].tries}` });
        }

        console.log("Valid OTP. Proceeding...");

        console.log("Updating stock and generating receipt...");

        // Reduce stock
        for (const item of medicines) {
            await Medicine.findOneAndUpdate(
                { name: item.name },
                { $inc: { quantity: -item.quantity } }
            );
        }

        console.log("Stock updated successfully");

        // Cleanup OTP storage
        delete otpStorage[recipient];

        res.json({ success: true, message: "OTP verified. Proceed" });
      } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
      }
};

const lodgeComplaint = async (data) => {
    try {
        const complaint = { recipient: data.recipient, medicines: data.medicines, date: new Date() };
        // Add the complaint to the vendor's complaints array
        await Vendor.findOneAndUpdate(
            { username: data.id },
            { $push: { complaints: complaint } }
        );
        console.log("Complaint lodged against vendor: ", data.id);
    } catch (error) {
        console.error("Error lodging complaint: ", error);
    }
}

const login = async (req, res) => {
    const {username, password } = req.body;
    console.log("Received request to login from vendor: ", username);
    // Check if any vedor exists with the given username and password
    const vendor = await Vendor.findOne({ username: username, password: password });
    if (vendor) {
        console.log("Login successful");

        return res.status(200).json({ success: true, message: "Login successful" });
    } else {
        console.log("Invalid username or password");
        return res.status(400).json({ success: false, error: "Invalid username or password" });
    }
};

module.exports = { checkMedicineAvailability, verifyOTP, login };