import User from '../models/user.model';

export const createUserService = async (input: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
}) => {
    const existingUser = await User.findOne({ email: input.email });

    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    // create new user with provided details
    const user = await User.create({
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role || 'user',
    });
    return user;
};

export const getAllUserService = async () => {
    const users = await User.find().sort({ createdAt: -1 });
    return users;
};

export const deleteUserService = async (id: string) => {
    // 🔍 Check if user exists
    const user = await User.findById(id);

    if (!user) {
        throw new Error('User not found');
    }

    // 🗑 Delete user
    await user.deleteOne();

    return { message: 'User deleted successfully' };
};

export const updateUserService = async (
    id: string,
    updateData: Partial<{
        name: string;
        email: string;
        password: string;
        role: 'user' | 'admin';
    }>
) => {
    // 🔍 Find if user exists
    const user = await User.findById(id);

    if (!user) {
        throw new Error('User not found');
    }

    // 🔄 Update the user using mongoose method
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true, // return updated doc
        runValidators: true, // re-check schema validations
    });

    return updatedUser;
};
