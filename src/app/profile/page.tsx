'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft, Camera, LogOut } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Edit logic
    const [formData, setFormData] = useState({
        name: '',
        semester: '',
        department: '',
        currentPassword: '',
        newPassword: ''
    });

    const [passwordMode, setPasswordMode] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/profile');
            setUser(res.data.user);
            setFormData(prev => ({
                ...prev,
                name: res.data.user.name,
                semester: res.data.user.semester || '',
                department: res.data.user.department || ''
            }));
        } catch (err) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        try {
            if (passwordMode) {
                await axios.put('/api/profile/change-password', {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                });
                setMsg({ type: 'success', text: 'Password updated successfully' });
                setPasswordMode(false);
            } else {
                const payload: any = {
                    name: formData.name,
                    department: formData.department
                };
                if (user.role === 'student') payload.semester = formData.semester;

                await axios.put('/api/profile', payload);
                fetchProfile(); // refresh
                setIsEditing(false);
                setMsg({ type: 'success', text: 'Profile updated successfully' });
            }
        } catch (err: any) {
            setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update' });
        }
    };

    // Mock Photo Upload (Client-side base64)
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64 = reader.result as string;
                await axios.put('/api/profile', { profilePicture: base64 });
                fetchProfile();
            } catch (err) {
                alert('Failed to upload photo');
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link href={user.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'}>
                        <Button variant="secondary" className="gap-2">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Button>
                    </Link>
                    <Button variant="danger" className="gap-2" onClick={() => {
                        // For simplicity, just clearing cookie and redirecting. 
                        // Ideally use a Logout API.
                        document.cookie = 'token=; Max-Age=0; path=/;';
                        router.push('/login');
                    }}>
                        <LogOut size={16} /> Logout
                    </Button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white dark:border-gray-800 shadow-xl">
                                {user.profilePicture ? (
                                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 bg-gray-100 dark:bg-gray-800">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                                <Camera size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                            </label>
                        </div>
                        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
                        <span className="px-3 py-1 mt-2 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full capitalize">
                            {user.role}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* View Mode */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold border-b pb-2 dark:border-gray-800">Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500">Email</label>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Department</label>
                                    <p className="font-medium">{user.department}</p>
                                </div>
                                {user.role === 'student' && (
                                    <>
                                        <div>
                                            <label className="text-sm text-gray-500">USN</label>
                                            <p className="font-medium">{user.usn}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Semester</label>
                                            <p className="font-medium">{user.semester}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Edit Mode */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold border-b pb-2 dark:border-gray-800">Actions</h2>

                            {!isEditing && !passwordMode ? (
                                <div className="space-y-3">
                                    <Button onClick={() => setIsEditing(true)} className="w-full" variant="secondary">
                                        Edit Profile Details
                                    </Button>
                                    <Button onClick={() => setPasswordMode(true)} className="w-full" variant="secondary">
                                        Change Password
                                    </Button>
                                    {user.profilePicture && (
                                        <Button
                                            variant="danger"
                                            className="w-full"
                                            onClick={async () => {
                                                await axios.put('/api/profile', { profilePicture: '' });
                                                fetchProfile();
                                            }}
                                        >
                                            Remove Profile Picture
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateProfile} className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                    {msg.text && (
                                        <div className={`text-sm ${msg.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                            {msg.text}
                                        </div>
                                    )}

                                    {passwordMode ? (
                                        <>
                                            <h3 className="font-medium">Change Password</h3>
                                            <Input
                                                type="password"
                                                placeholder="Current Password"
                                                value={formData.currentPassword}
                                                onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                            />
                                            <Input
                                                type="password"
                                                placeholder="New Password"
                                                value={formData.newPassword}
                                                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="font-medium">Edit Details</h3>
                                            <Input
                                                label="Name"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <Input
                                                label="Department"
                                                value={formData.department}
                                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                            />
                                            {user.role === 'student' && (
                                                <Input
                                                    label="Semester"
                                                    value={formData.semester}
                                                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                                />
                                            )}
                                        </>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        <Button type="submit" className="flex-1">Save</Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setPasswordMode(false);
                                                setMsg({ type: '', text: '' });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
