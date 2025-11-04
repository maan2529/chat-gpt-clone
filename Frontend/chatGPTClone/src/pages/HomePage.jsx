
import { useNavigate, useOutletContext } from 'react-router';
import InputBox from '../components/inputBox';
import { useSelector, useDispatch } from 'react-redux'
import { addMessages } from '../store/feature/message/messageSlice';
import socket from '../socketServer/socketServer';
import { useCreateChat } from '../hooks/titleHooks/titleHook';


const HomePage = () => {
    const dispatch = useDispatch()
    const { mutate, error, isLoading } = useCreateChat()

    const navigate = useNavigate()


    const handleOnSubmit = async (data) => {
        console.log(data)
        try {
            // Ensure socket is connected
            if (!socket.connected) {
                await new Promise((resolve) => {
                    socket.once('connect', resolve);
                    socket.connect();
                });
            }

            const firstMsg = {
                _id: Date.now().toString(), // Use string for consistency
                role: "user",
                text: data.userText,
            };

            dispatch(addMessages(firstMsg));

            mutate(data?.userText, {
                onSuccess: (chat) => {
                    console.log(chat)
                    // Small delay to ensure backend is ready
                    setTimeout(() => {
                        navigate(`/home/chat/${chat.chat._id}`, {
                            state: { data: firstMsg }
                        })
                    }, 100);
                }
            })

        } catch (error) {
            console.error("API ERROR:", error.response?.data || error.message);
        }
    };



    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="relative flex  flex-col justify-center h-full px-5 sm:px-0 ">

            {/* Main Chat Area */}
            <div className=" flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-white mb-4">How can I help you today?</h1>
                </div>
            </div>


            {/* Input Area */}
            <div className="w-full px-4 py-6 sm:px-6 fixed bottom-2 left-0 md:static">
                <div className="mx-auto max-w-[48rem]">
                    <InputBox
                        handleOnSubmit={handleOnSubmit}
                        containerClassName="max-w-full"
                    />
                </div>
            </div>

        </div>
    )
}

export default HomePage