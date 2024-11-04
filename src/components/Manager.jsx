import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "", id: null });
    const [passwordArray, setPasswordArray] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [updatedData, setUpdatedData] = useState({});
    
    const getPasswords = async () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            toast.error("User not logged in");
            return;
        }
        try {
            const req = await fetch("http://localhost:3000/api/passwords", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const passwords = await req.json();
            if (Array.isArray(passwords)) setPasswordArray(passwords);
        } catch (error) {
            toast.error("Failed to fetch passwords");
        }
    };

    useEffect(() => {
        getPasswords();
    }, []);

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        toast("Copied to clipboard!");
    }

    const savePassword = async () => {
        if (form.site && form.username && form.password) {
            const payload = { ...form };
            try {
                const response = form.id
                    ? await fetch(`http://localhost:3000/api/passwords/${form.id}`, { // Use the ID for updating
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(payload),
                    })
                    : await fetch("http://localhost:3000/api/passwords", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(payload),
                    });
    
                if (response.ok) {
                    await getPasswords(); // Refresh the password list after saving
                    toast.success(form.id ? "Password updated successfully" : "Password saved successfully");
                    setForm({ site: "", username: "", password: "", id: null }); // Clear form after save
                } else {
                    throw new Error("Failed to save password");
                }
            } catch (error) {
                toast.error("Error saving password");
            }
        } else {
            toast.error("Please fill in all fields");
        }
    };

    const deletePassword = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this password?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/api/passwords/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (response.ok) {
                await getPasswords();
                toast.success("Password deleted successfully");
            } else {
                throw new Error("Failed to delete password");
            }
        } catch (error) {
            console.log('Deleting password with ID:', id);
            toast.error("Error deleting password");
        }
    };

    const editPassword = async () => {
        if (!selectedId) return; // Don't proceed if no ID is selected

        console.log("Edit ID:", selectedId); // Log the ID for debugging
        console.log("Updating with:", updatedData); // Log the updated data for debugging

        try {
            const response = await fetch(`http://localhost:3000/api/passwords/${selectedId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to update password: ${data.message}`);
            }

            // Update local state to reflect the updated password
            setPasswordArray((prev) =>
                prev.map((password) => (password._id === selectedId ? { ...password, ...updatedData } : password))
            );

            toast.success("Password updated successfully");
            console.log("Password updated successfully:", data);
            setSelectedId(null); // Reset the selected ID after edit
        } catch (error) {
            console.error("Failed to update password:", error);
        }
    };

    const handleEditClick = (id) => {
        const passwordToEdit = passwordArray.find((password) => password._id === id);
        setForm({
            site: passwordToEdit.site,
            username: passwordToEdit.username,
            password: passwordToEdit.password,
            id: passwordToEdit._id // Keep the ID to send with the update
        });
        setSelectedId(id);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer />
            <div className="p-3 md:mycontainer min-h-[88.2vh]">
                <h1 className="text-4xl font-bold text-center">
                    <span className="text-green-500"> &lt;</span>PassOP<span className="text-green-500">/&gt;</span>
                </h1>
                <p className="text-green-900 text-lg text-center">Your own Password Manager</p>

                <div className="flex flex-col p-4 text-black gap-8 items-center">
                    <input
                        value={form.site}
                        onChange={handleChange}
                        placeholder="Enter website URL"
                        className="rounded-full border border-green-500 w-full p-4 py-1"
                        type="text"
                        name="site"
                    />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            className="rounded-full border border-green-500 w-full p-4 py-1"
                            type="text"
                            name="username"
                        />
                        <div className="relative">
                            <input
                                ref={passwordRef}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                className="rounded-full border border-green-500 w-full p-4 py-1"
                                type="password"
                                name="password"
                            />
                            <span className="absolute right-[3px] top-[4px] cursor-pointer">
                                <img ref={ref} className="p-1" width={26} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className="bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900">
                        {form.id ? "Update" : "Save"}
                    </button>
                </div>

                <div className="passwords">
                    <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
                    {Array.isArray(passwordArray) && passwordArray.length === 0 ? (
                        <div>No passwords to show</div>
                    ) : (
                        <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                            <thead className="bg-green-800 text-white">
                                <tr>
                                    <th className="py-2">Site</th>
                                    <th className="py-2">Username</th>
                                    <th className="py-2">Password</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-green-100">
                                {passwordArray.map((item) => (
                                    <tr key={item._id}>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center '>
                                                <a href={item.site} target='_blank' rel="noopener noreferrer">{item.site}</a>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => copyText(item.site)}>
                                                    <lord-icon
                                                        style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover">
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            {item.username}
                                            <div className='lordiconcopy size-7 cursor-pointer inline-block' onClick={() => copyText(item.username)}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            {item.password}
                                            <div className='lordiconcopy size-7 cursor-pointer inline-block' onClick={() => copyText(item.password)}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                        <span className='cursor-pointer mx-1' onClick={() => handleEditClick(item._id)}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => deletePassword(item._id)}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover"
                                                    style={{ width: "25px", height: "25px" }}>
                                                </lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default Manager;
