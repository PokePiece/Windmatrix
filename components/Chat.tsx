'use client';

import React, { useState } from 'react';

const Chat = ({title, bodyPlaceholder, inputPlaceholder, aiTag}:{title: string, bodyPlaceholder: string, inputPlaceholder: string, aiTag: string}) => {
    const [input, setInput] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); 

    const handleSubmit = async (e:any) => {
        console.log("handleSubmit triggered");

        e.preventDefault();
        if (!input.trim()) return;

        setInput(''); 
        setIsLoading(true); 
        setResponse(''); 

        try {
            
            const res = await fetch("https://void.dilloncarey.com/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt: input, max_tokens: 1000, tag: aiTag })
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                setResponse("Error: Invalid response format.");
                console.warn("Raw response:", text);
                return; 
            }

            setResponse(data.response || "No valid reply field.");
        } catch (err) {
            setResponse("Error: Unable to reach the assistant.");
            console.error(err);
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <section id="chat" className="w-full py-20 c-space border-slateGray">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                <h2 className="text-white text-3xl font-semibold text-center">{title}</h2> 

                <div className="w-full min-h-[150px] bg-cyan-900 border-slateGray rounded-xl p-6 text-white text-lg transition-all duration-200">
                    {response ? (
                        <p>{response}</p>
                    ) : (
                        <p className="italic opacity-60">{bodyPlaceholder}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={inputPlaceholder}
                        className="flex-1 px-4 py-3 rounded-md bg-gray-300 text-black border-slateGray focus:outline-none focus:ring-2 focus:ring-slateGray"
                        disabled={isLoading} 
                    />
                    <button
                        type="submit"
                        className={`px-6 py-3 bg-gray-500 text-white rounded-md transition-all duration-200 
                                    ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-opacity-80'}`}
                        disabled={isLoading} 
                    >
                        {isLoading ? 'Sending...' : 'Send'} 
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Chat;