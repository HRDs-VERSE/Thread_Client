
import {
	Flex,
	Box,
	FormControl,
	Input,
	InputGroup,
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
import useUserApi from '../api/userAPI';


export default function SignupCard() {
	const showToast = useShowToast()
	const { login } = useUserApi()
	const setUser = useSetRecoilState(userAtom)
	const [showPassword, setShowPassword] = useState(false)
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const apiURL = import.meta.env.VITE_API_URL;
	const [input, setInput] = useState({
		credential: "",
		password: ""

	})
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)

		await login(setUser, input)

		setLoading(false)
		
	}

	return (
		<Flex
			align={'center'}
			justify={'center'}>
			<Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
				<Stack align={'center'}>
					<Heading fontSize={'4xl'} textAlign={'center'}>
						login
					</Heading>
				</Stack>
				<Box
					bg={useColorModeValue('white', '#0f0f0f')}
					boxShadow={'lg'}
					p={8}
					w={{
						base: "full",
						sm: "400px",
					}}
					className='rounded-[1rem]'

				>
					<Stack spacing={4}>
						<FormControl isRequired>
							<Input type="email"
								h={"3rem"}
								rounded={".7rem"}
								placeholder='email or username'
								onChange={(e) => setInput({ ...input, credential: e.target.value })}
								value={input.credential} />
						</FormControl>
						<FormControl isRequired>
							<InputGroup>
								<Input type={showPassword ? 'text' : 'password'}
									w={"18rem"}
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
								loadingText="Loggin In"
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
								Log In
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={'center'}>
								Don't have an acc? <Link color={'blue.400'} onClick={() => setAuthScreen("signup")}>sign up</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>

	)
}