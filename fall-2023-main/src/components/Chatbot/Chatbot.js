import React, { useEffect, useState } from 'react'
import './Chatbot.css'
import { Send } from '@material-ui/icons';
import axios from 'axios'

export const Chatbot = () => {
    let hide = {
        display: 'none',
    }
    let show = {
        display: 'block'
    }
    let textRef = React.createRef()

    const [chatopen, setChatopen] = useState(false)
    const [text, setText] = useState("");
    const [messages, setMessages] = useState(["Welcome to chat bot"])
    const [loading, setLoading] = useState(false);
    const toggle = e => {
        setChatopen(!chatopen)
    }

    const updateScroll = () => {
        var element = document.getElementById("msgDiv");
        element.scrollTop = element.scrollHeight ;
    }

    useEffect(() => {
        setLoading(true)
        const cardItem = JSON.parse(localStorage.getItem("CARD_ITEM"));
        const data = {
            message: cardItem?._source?.text,
            title: cardItem?._source?.title
        }
        axios({
            url: 'http://localhost:5000/v1/chat?loadText=true',
            method: 'POST',
            data: data,
            headers: {
                // 'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res.data[0].message.content);
            setMessages(current => [...current, res.data[0].message.content])
            updateScroll()
            setLoading(false)
        }).catch(e => {
            console.log(e);
            setMessages(current => [...current, "Error while conversing with bot"])
            updateScroll()
            setLoading(false)
        });
        
    }, [])

    const handleSend = e => {
        console.log(text);
        handleSendMessage(text);
        setText('');
    }

    const handleSendMessage = (msg) => {
        setLoading(true)
        setMessages(current => [...current, msg])
        const data = {
            message: msg
        }
        axios({
            url: 'http://localhost:5000/v1/chat',
            method: 'POST',
            data: data,
            headers: {
                // 'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res.data[0].message.content);
            setMessages(current => [...current, res.data[0].message.content])
            updateScroll()
            setLoading(false)
        }).catch(e => {
            console.log(e);
            setMessages(current => [...current, "Error while conversing with bot"])
            updateScroll()
            setLoading(false)
        });
        
    }

    useEffect(() => {
        return () => {
            return () => {
                axios({
                    url: 'http://localhost:5000/v1/chat?clearMessages=true',
                    method: 'POST',
                    data: {
                        message: "Thank you for the help"
                    },
                    headers: {
                        // 'Authorization': `bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }).then(res => console.log("Cleared the messages"))
                    .catch(e => console.log("error while clearing the messages"))
            }
        }
    }, [])

    return (
        <div id='chatCon'>
            <div className="chat-box" style={chatopen ? show : hide}>
                <div className="header">Chat with BOT</div>
                <div id="msgDiv" className="msg-area">
                    {
                        messages.map((msg, i) => (
                            i % 2 ? (
                                <p class="right"><span>{msg}</span></p>
                            ) : (
                                <p class="left"><span>{msg}</span></p>
                            )
                        ))
                    }

                </div>
                <div className="footer">
                    <input type="text" value={text} ref={textRef} onChange={(e) => setText(e.target.value)} />
                    {loading ? <p><b>.....</b></p> :<button onClick={handleSend}><Send /></button>}
                </div>
            </div>
            <div className="pop">
                <p><img onClick={toggle} src="/images/chatIcon.png" alt="" /></p>
            </div>
        </div>
    )
}

export default Chatbot