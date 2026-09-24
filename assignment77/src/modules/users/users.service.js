
import User from "../../DB/models/users.model.js";


export const signup = async (req, res,next) => {
  try {
    const { name, email, password, phone, age } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const newUser = await User.create(req.body);

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        age: newUser.age,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  next();
};

export const login = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const matchedUser = await User.findOne({ name, password });

    if (!matchedUser) {
      return res.status(401).json({ message: "Invalid name or password" });
    }
else 
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: matchedUser._id,
        name: matchedUser.name,
        email: matchedUser.email,
        phone: matchedUser.phone,
        age: matchedUser.age,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.query; 
    const { name, email, age } = req.body; 

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: id }, 
      });
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, age },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.query;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
};
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.query;

    const foundUser = await User.findById(id).select("-password"); 

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: foundUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
