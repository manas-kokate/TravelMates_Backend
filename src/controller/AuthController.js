import User from "../models/user.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body);

        // existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        }
        );

        if (existingUser) {
            return res.send({
                status: 201,
                message: "User already exists...!"
            })
        }

        const newUser = new User({
            username,
            email,
            password: password
        })

        await newUser.save();

        return res.send({
            status: 201,
            message: "User registered successfully...!",
            user: newUser
        })

    } catch (error) {
        return res.send({
            status: 500,
            message: error.message
        })
    }
}
