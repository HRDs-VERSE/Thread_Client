import {
  Flex,
  Box,
  FormControl,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';

export default function SignupCard() {
  const [loading, setLoading] = useState(false)
  const showToast = useShowToast()
  const setUser = useSetRecoilState(userAtom)
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const apiURL = import.meta.env.VITE_API_URL;
  const [input, setInput] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",

  })

  const handleSubmit = async () => {
    setLoading(true)
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
      
      setInput({
        fullName: "",
        username: "",
        email: "",
        password: "",
      })


    } catch (error) {
      showToast("error", error.message || "Something went wrong while sign up", "error")
    } finally{
      setLoading(false)
    }
  }

  return (
    <Flex
      align={'center'}
      justify={'center'}>
      <Stack spacing={8}  maxW={'lg'} >
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', '#0f0f0f')}
          boxShadow={'lg'}
          p={8}
          className='rounded-[1rem] w-auto'
          >
          
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <Input type="text"
                    h={"3rem"}
                    rounded={".7rem"}
                    placeholder='full name'
                    onChange={(e) => setInput({ ...input, fullName: e.target.value })}
                    value={input.fullName}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <Input type="text"
                    h={"3rem"}
                    rounded={".7rem"}
                    placeholder='username'
                    onChange={(e) => setInput({ ...input, username: e.target.value })}
                    value={input.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <Input type="email"
                h={"3rem"}
                rounded={".7rem"}
                placeholder='email'
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                value={input.email}
              />
            </FormControl>
            <FormControl isRequired>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'}
                  h={"3rem"}
                  rounded={".7rem"}
                  placeholder='password'
                  onChange={(e) => setInput({ ...input, password: e.target.value })}
                  value={input.password}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                ml={"11rem"}
                w={"14rem"}
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("black", "white"),
                  color: useColorModeValue("white", "black")
                }}
                onClick={handleSubmit}
                isLoading={loading}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'} onClick={() => setAuthScreen("login")}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
} ''