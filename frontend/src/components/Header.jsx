import { Box, Flex, Image, useColorMode, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { GoHome } from "react-icons/go";
import { RxAvatar } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { changeMode } from "../store/modeSlice";

import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast"

function Header() {

  const themeMode = useSelector((state) => state.mode.mode)
  const dispatch = useDispatch();
  const user = useRecoilValue(userAtom);
  const { colorMode, toggleColorMode } = useColorMode();
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
    if (colorMode === "light") {
      dispatch(changeMode(false))
    } else {
      dispatch(changeMode(true))
    }
  }, [colorMode])




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
          <Link to={`searchpage`}>
            <Box
              className={`border-2 border-white p-3 rounded-[1rem] mx-5 duration-[.2s] transition-transform 
            ${colorMode === "dark" ? "hover:bg-[#121212]" : "hover:bg-gray-200"}
            ${themeMode ? "border-[#121212]" : "border-white"}`}
              _hover={{
                transform: 'scale(1.1)'
              }}

            >
              <IoSearchOutline size={40} />
            </Box>
          </Link>

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

    </Flex>
  );
}

export default Header;
