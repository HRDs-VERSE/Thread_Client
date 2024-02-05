import React, { useEffect, useState } from 'react';
import useUserApi from '../api/userAPI';
import { useSelector } from 'react-redux';
import SearchedProfile from "./SearchedProfile"

function SearchUsers() {
    const [userData, setUserData] = useState([]);
    const mode = useSelector((state) => state.mode.mode);
    const [userValue, setUserValue] = useState("");
    const { fetchUser } = useUserApi();

    useEffect(() => {

        const fetchData = async () => {
            try {
                const data = await fetchUser(userValue, setUserData);
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userValue !== '') {
            fetchData();
        } else {
            setUserData([]);
        }

    }, [userValue]);



    return (
        <div className='w-full flex justify-center flex-col items-center'>
            <input
                className={`w-[35rem] h-[3rem] border-[1px] p-[1rem] outline-none rounded-[10rem] text-[20px] ${mode ? 'bg-[black] border-[white]' : 'bg-white border-[#c6c6c6]'
                    }`}
                value={userValue}
                placeholder={`Search Users`}
                onChange={(e) => setUserValue(e.target.value)}
            />
            {userValue
                ?
                <div className='mt-[3rem]'>
                    {userData?.map((user) => (
                        <SearchedProfile user={user} />
                    ))}
                </div>
                :
                <h1 className='mt-[10rem] font-bold text-[3rem]'>!No results</h1>}
        </div>
    );
}

export default SearchUsers;
