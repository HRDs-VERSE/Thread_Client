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
                body: JSON.stringify({ value : userValue })
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

    const handleFollow = async (currentUser, user, setFollowing, following) => {
        if (!currentUser) {
            showToast("Error", "Please Login to Follow", "error");
            return;
        }

        // setUpdating(true);

        try {
            const res = await fetch(`${apiURL}/api/v1/users/follow-un-follow/${user?._id}`, {
                method: "POST",
                headers: {
					"Content-Type": "application/json"
				},
                body: JSON.stringify({currentUserId: currentUser?._id})
            });

            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error.message, "error");
                return;
            }

            const updatedUserResponse = await fetch(`${apiURL}/api/v1/users/${currentUser?.username}`);
            const updatedUserData = await updatedUserResponse.json();

            // Update the local storage or state with the updated user data
            localStorage.setItem("user-threads", JSON.stringify(updatedUserData));

            // Update your state or context with the updated user data if needed
            if (following) {
                user.followers.pop();
            } else {
                user.followers.push(currentUser?._id);
            }
            setFollowing(!following);
        } catch (error) {
            showToast("Error", error.message, "error");
        } 
        // finally {
        //     setUpdating(false);
        // }
    };


    return { 
        fetchUser, 
        handleFollow };
};

export default useUserApi;
