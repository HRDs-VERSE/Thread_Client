import useShowToast from "../hooks/useShowToast";

const useUserApi = () => {
    const showToast = useShowToast();
    const apiURL = import.meta.env.VITE_API_URL;

    const fetchUser = async (userValue) => {
        try {
            const res = await fetch(`${apiURL}/api/v1/users/search-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ value: userValue })
            });

            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error, "error");
                return null;
            }

            return data;

        } catch (error) {
            showToast("Error", "Something went wrong while searching users", "error");
            return null;
        }
    };
    
    const signUp = async (input, setUser) => {
        try {
      
            const res = await fetch(`${apiURL}/api/v1/users/register`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(input)
            })
            const data = await res.json() 
            if (data.error) {
              showToast("error", data.error, "error")
              return  
            }
      
            localStorage.setItem("user-threads", JSON.stringify(data))
            setUser(data)
        
          } catch (error) {
            showToast("error", error.message || "Something went wrong while sign up", "error")
          }
    }


    const login = async (setUser, input) => {
        try {

            const res = await fetch(`${apiURL}/api/v1/users/login`, {
                method: "POST",
                // credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            // Continue handling the response as needed

            const data = await res.json()
            if (data.error) {
                showToast("error", data.error, "error")
                return
            }

            localStorage.setItem("user-threads", JSON.stringify(data))
            setUser(data)


        } catch (error) {
            showToast("error", error.message || "Something went wrong whilel logging in", "error")
        }
    }

    const getUser = async (username, setUser) => {
        try {
            const res = await fetch(`${apiURL}/api/v1/users/${username}`)
            const data = await res.json()
            if (data.error) {
                showToast("Error", data.error, "error")
            }
            setUser(data)
        } catch (error) {
            showToast("Error", error, "error")
        }
    }

    const updateProfile = async (input, imgUrl, currentUserId, setUser) => {
        try {
            const res = await fetch(`${apiURL}/api/v1/users/update-account-details`, {
             method: "PATCH",
             headers: {
               "Content-Type": "application/json"
             },
             body: JSON.stringify({...input, avatar: imgUrl, userId : currentUserId})
            })
     
            const data = await res.json()
            if (data.error) {
             showToast("Error", data.error, "error")
            }
            showToast("Success", "Profile updated successfully", "success")
            setUser(data)
            localStorage.setItem("user-threads", JSON.stringify(data)); 
           
         } catch (error) {
           showToast("Error", error.message, "error")
         }
         
    }

    const handelFollow = async (currentUser, user) => {
        try {

            const res = await fetch(`${apiURL}/api/v1/follow/follow-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: currentUser?._id, followingId: user?._id })
            });

            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error.message, "error");
                return;
            }


        } catch (error) {
            showToast("Error", error.message, "error")
        }

    }


    const getUserFollowers = async (user, setFollowers) => {

        try {
            const res = await fetch(`${apiURL}/api/v1/follow/user-followers/${user?.username}`)
            const data = await res.json()

            if (data.error) {
                showToast("Error", data.error || "Something went wrong while fetching follower", "error")
            }

            setFollowers(data)

        } catch (error) {
            showToast("Error", error.message || "Something went wrong in getUserFollowers")
        }
    }


    const getUserFollowing = async (user, setFollowing) => {

        try {
            const res = await fetch(`${apiURL}/api/v1/follow/user-following/${user?.username}`)
            const data = await res.json()

            if (data.error) {
                showToast("Error", data.error || "Something went wrong while fetching follower", "error")
            }

            setFollowing(data)

        } catch (error) {
            showToast("Error", error.message || "Something went wrong in getUserFollowers")
        }
    }




    return {
        getUser,
        login,
        fetchUser,
        handelFollow,
        getUserFollowers,
        getUserFollowing,
        signUp,
        updateProfile
    };

};

export default useUserApi;
