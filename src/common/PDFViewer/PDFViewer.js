import React, { useEffect, useState } from 'react';
import { ArrowDownwardOutlined } from '@material-ui/icons';
import Chatbot from '../../components/Chatbot/Chatbot';
import './PDFViewer.css'
import axios from 'axios'

const DownloadPath = "/PDF/"
const PdfViewer = () => {
    const [card, setCard] = useState({});

    // const [chatHistory, setChatHistory] = useState([])

    useEffect(() => {
        const cardItem = JSON.parse(localStorage.getItem("CARD_ITEM"));
        console.log(cardItem)
        setCard(cardItem)

        
        // unmounting the component
        // return () => {
        //     axios({
        //         url: 'http://localhost:5000/v1/chat?flushMessages=true',
        //         method: 'POST',
        //         data: {
        //             message: "Thank you for the help"
        //         },
        //         headers: {
        //             // 'Authorization': `bearer ${token}`,
        //             'Content-Type': 'application/json'
        //         }
        //     }).then(res => console.log("Flushed the messages"))
        //         .catch(e => console.log("error while flushing the messages"))
        // }
    }, [])


    return (
        <div className="pdf-viewer-container">
            <Chatbot cardItem={card}/>
            <div className="metadata-container">
                <h2>PDF Metadata</h2>
                <div>
                    <p><u><b>Author:</b></u> {card?._source?.author}</p>
                    <p><u><b>Program:</b></u> {card?._source?.program}</p>
                    <p><u><b>Degree:</b></u> {card?._source?.degree}</p>
                    <p><u><b>Abstract:</b></u> {card?._source?.text}</p>
                    <div><a href={DownloadPath + card?._source?.etd_file_id + '.pdf'} target="_blank">Download PDF <ArrowDownwardOutlined /></a></div>
                </div>
            </div>

        </div>
    );
};

export default PdfViewer;
