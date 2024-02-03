import { Box, Flex, Image, useColorMode, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { GoHome } from "react-icons/go";
import { RxAvatar } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { changeMode, changeFilter } from "../store/modeSlice";

import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast"

function Header() {

  const themeMode = useSelector((state) => state.mode.mode)
  const showToast = useShowToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const user = useRecoilValue(userAtom);
  const { colorMode, toggleColorMode } = useColorMode();
  const apiURL = import.meta.env.VITE_API_URL;
  const [userValue, setUserValue] = useState({
    value: ""
  })

  const handleToggleColorMode = () => {
    toggleColorMode();
    if (!themeMode) {

      dispatch(changeMode(true));
    } else {

      dispatch(changeMode(false));

    }
  };


  useEffect(() => {
    const fetchUserSearchResults = async () => {
      try {
        const res = await fetch(`${apiURL}/api/v1/users/search-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userValue)
        })

        const data = await res.json();
        if (data.error) {

          showToast("Error", data.error, "error");
        }

      } catch (error) {
        showToast("Error", "Something went wrong while searching users", "error");
      }
    };

    if (userValue.value !== "") {
      fetchUserSearchResults();
    }

  }, [userValue]);

  useEffect(() => {
    if (isOpen) {
      dispatch(changeFilter(true)); // Dispatch true when modal is open
    } else {
      dispatch(changeFilter(false)); // Dispatch false when modal is closed
    }
  }, [isOpen, dispatch]);

  useEffect(() => { 
    if(colorMode === "light"){
      dispatch(changeMode(false))
    }else{
      dispatch(changeMode(true))
    }
  },[colorMode])




  return (

    <Flex mt="6" mb="12">
      <Image
        className={`${!user && " relative left-[13.6rem]"}`}
        cursor="pointer"
        alt="logo"
        w="50px"
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={handleToggleColorMode}
      />

      {user && (
        <div className="flex mx-[10rem] ">
          <Link to="/">
            <Box
              className={`border-2 border-white p-3 rounded-[1rem] md:mx-5 ml-[-2rem] duration-[.2s] transition-transform 
              ${colorMode === "dark" ? "hover:bg-[#121212]" : "hover:bg-gray-200"} 
              ${themeMode ? "border-[#121212]" : "border-white"}`}
              _hover={{
                transform: 'scale(1.1)'
              }}
            >
              <GoHome size={40} className="md:h:20" />


            </Box>

          </Link>

          <Box
            className={`border-2 border-white p-3 rounded-[1rem] mx-5 duration-[.2s] transition-transform 
              ${colorMode === "dark" ? "hover:bg-[#121212]" : "hover:bg-gray-200"}
              ${themeMode ? "border-[#121212]" : "border-white"}`}
            _hover={{
              transform: 'scale(1.1)'
            }}
            onClick={onOpen}
          >
            <IoSearchOutline size={40} />
          </Box>

          <Link to={`/${user.username}`}>
            <Box
              className={`border-2 border-white p-3 rounded-[1rem] mx-5 duration-[.2s] transition-transform   
                ${colorMode === "dark" ? "hover:bg-[#121212]" : "hover:bg-gray-200"} 
                ${themeMode ? "border-[#121212]" : "border-white"}`}
              _hover={{
                transform: 'scale(1.1)'
              }}
            >
              <RxAvatar size={40} />
            </Box>
          </Link>
        </div>
      )}

      <Modal onClose={onClose} isOpen={isOpen} motionPreset='slideInBottom'>
        <ModalOverlay />
        <ModalContent bg="transparent">
          <ModalBody bg={"transparent"}>
            <input
              placeholder="search users"
              className="border-3 focus:border-[white]  h-[4rem] w-[24rem] rounded-[1rem] text-xl p-5 outline-none bg-slate-100 "
              onChange={(e) => setUserValue({ ...userValue, value: e.target.value })}
              value={userValue.value}
            />

          </ModalBody>
        </ModalContent>
      </Modal>

    </Flex>
  );
}

export default Header;
