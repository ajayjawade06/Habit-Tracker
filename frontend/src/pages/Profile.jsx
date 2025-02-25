import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { axiosInstance } from '../config';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    bio: '',
    address: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
        address: user.address || '',
      });
      if (user.profilePicture) {
        setPreviewUrl(`http://localhost:5003${user.profilePicture}`);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      await axiosInstance.put('/auth/profile/update',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      await axiosInstance.get('/auth/dashboard/me');
      setMessage('Profile updated successfully!');
      setTimeout(() => {
        navigate('/user-info');
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300 border border-white/10"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="relative py-3 w-full max-w-md mx-auto sm:max-w-xl">
          <div className="relative px-4 py-8 bg-white/5 backdrop-blur-sm shadow-2xl rounded-xl sm:p-10 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-full">
              <div className="space-y-6">
                <div className="py-8 text-base leading-6 space-y-4 text-white sm:text-lg sm:leading-7">
                  <h2 className="text-3xl font-bold mb-8 text-center text-white">Edit Profile</h2>
                  {message && (
                    <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-white hover:bg-white/10 transition-all duration-300">
                      {message}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div className="flex justify-center mb-6 sm:mb-8">
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                        <img
                          src={previewUrl || 'https://via.placeholder.com/150'}
                          alt="Profile"
                          className="relative w-32 h-32 rounded-full object-cover border-2 border-white/20"
                        />
                        <label className="absolute bottom-0 right-0 bg-white/10 backdrop-blur-sm rounded-full p-2 cursor-pointer border border-white/20 transition-all duration-300 hover:bg-white/20">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:bg-white/10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:bg-white/10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:bg-white/10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:bg-white/10"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-500 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;