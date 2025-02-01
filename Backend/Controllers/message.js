require('dotenv').config();

// POST method for sending message
const send = async (req, res) => {
    try {
        const { content, from, to } = req.body;
        const response = await fetch('https://api.httpsms.com/v1/messages/send', {
            method: "POST",
            headers: {
                "x-api-key": process.env.SMS_API_TOKEN,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                content: content,
                from: from,
                to: to
            })
        });
        const data = await response.json();
        if (!response.ok) {
            return res.status(400).json({ success: false, message: data.message });
        }
        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
// POST method for receiving message
const receive = (req, res) => {
    console.log(req.body);
    return res.status(200).json({ success: true, message: 'Message received successfully' });
}

module.exports = { send, receive };