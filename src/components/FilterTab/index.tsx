import { useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap"
import { BsCheckLg } from "react-icons/bs";
import { ClipLoader } from "react-spinners"
import { ContactProps, TagsProps } from "../../types";
import { css } from "@emotion/react";
import { API } from "../../API";
import { EndPoints } from "../../consts";


const override = css`
    display: block;
    margin: 136px auto;
`;

export const FilterTab:React.FC<any> = ({getContacts}) => {

    const getAllTags = async () => {
        try {
            const res = await API.get(EndPoints.GetTags);
            setTags(res.data.tags);
        } catch(error) {
            console.log(error);
        }
    };
    
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tags, setTags] = useState<TagsProps[]>([]);
    const [excludeTags, setExcludeTags] = useState<string[]>([]);
    const [minMessageSent, setMinMessageSent] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [maxMessageSent, setMaxMessageSent] = useState<number>(0);
    const [minMessageRiceved, setMinMessageRiceved] = useState<number>(0);
    const [maxMessageRiceved, setMaxMessageRiceved] = useState<number>(0);
    const [messagesQuery, setMessagesQuery] = useState<string[]>([])


    
    const handleSelectedTags = (value: string) => {
        if(!selectedTags.includes(value)) {
            setSelectedTags([...selectedTags, value]);
        } else {
            setSelectedTags(selectedTags.filter((name:string) => name !== value));
        }
    };

    const handleExcludeSelectedTags = (e: any) => {
        if(!excludeTags.includes(e.target.value)) {
            setExcludeTags([...excludeTags,e.target.value]);
        } else {
            setExcludeTags(excludeTags.filter((name: string) => name !== e.target.value));
        }
    };
    

    const handleChangeMinMessageSent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +(e.target.value.replace(/\D/g, ""));
        setMinMessageSent(value);
    };
    
    const handleChangeMaxMessageSent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +(e.target.value.replace(/\D/g, ""));
        setMaxMessageSent(value);

    };

    const handleChangeMinMessageRecv = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +(e.target.value.replace(/\D/g, ""));
        setMinMessageRiceved(value)
    };

    const handleChangeMaxMessageRecv = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +(e.target.value.replace(/\D/g, ""));
        setMaxMessageRiceved(value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        selectedTags.length > 0 && getContacts(`${selectedTags.map((a: string) =>  `tags=${a}&`).join('').slice(0, -1)}`);
        excludeTags.length > 0 && getContacts(`${excludeTags.map((a: string) =>  `notTags=${a}&`).join('').slice(0, -1)}`);
        minMessageSent > 0 && setMessagesQuery(e => [...e, `minMessagesSent=${minMessageSent}`]);
        maxMessageSent > 0 &&  setMessagesQuery(e => [...e, `maxMessagesSent=${maxMessageSent}`]);
        minMessageRiceved > 0 &&  setMessagesQuery(e => [...e, `minMessagesRecv=${minMessageRiceved}`]);
        maxMessageRiceved > 0 &&  setMessagesQuery(e => [...e, `maxMessagesRecv=${maxMessageRiceved}`]);
    };

    useEffect(() => {
        if(messagesQuery.length > 0) {
            getContacts(`${messagesQuery.map((a: string) =>  `${a}&`).join('').slice(0, -1)}`);
            setMessagesQuery([]);
        }
    }, [messagesQuery])

    useEffect(() => {
        getAllTags()
    }, []);

    return (
        <form onSubmit={handleSubmit}>
                <Col className='mt-4'>
                    <h4>Include Tags:</h4>
                    <div className="d-grid gap-2">                                        
                    {
                            tags.length > 0 
                            ?
                                tags.map((tag, i) =>  (
                                    <Button 
                                        key={`${tag.name}-${i}`}
                                        variant={selectedTags.includes(tag.name) ? "success" : "outline-success"} 
                                        size={"sm"} 
                                        value={tag.name} 
                                        onClick={() => handleSelectedTags(tag.name)}
                                        className="position-relative"
                                    >
                                        {tag.name}
                                        {selectedTags.includes(tag.name) &&  
                                            <div className="checked_container">
                                                <BsCheckLg color="white" />
                                            </div>
                                        }
                                    </Button>
                                ))
                            :
                                <ClipLoader color={'#198754'} loading={loading} css={override} size={38} />
                        }
                    </div>
                </Col>
                <Col className='mt-4'>
                    <h4>Exclude Tags:</h4>
                    <div className="d-grid gap-2">
                        {   
                            tags.length > 0
                            ?
                                tags.map((tag, i) =>  (
                                    <Button 
                                        key={`${tag.name}+${i}`}
                                        variant={excludeTags.includes(tag.name) ? "success" : "outline-success"} 
                                        size={"sm"} 
                                        value={tag.name} 
                                        onClick={handleExcludeSelectedTags}
                                        className="position-relative"
                                    >
                                        {tag.name}
                                        {excludeTags.includes(tag.name) &&  
                                            <div className="checked_container ">
                                                <BsCheckLg  color="white" />
                                            </div>
                                        }
                                    </Button>
                                ))
                            :
                            <ClipLoader color={'#198754'} loading={loading} css={override} size={38}/>
                        }
                    </div>
                </Col>
                <Col className='mt-4'>
                    <h4>Message Sent:</h4>
                    <div className="range_input_container">
                        <div>
                            <label>Min</label>
                            <input 
                                type='text' 
                                className="range_input" 
                                placeholder="Min"
                                value={minMessageSent}
                                onChange={handleChangeMinMessageSent}
                            />
                        </div>
                        <div>
                            <label>Max</label>
                            <input 
                                type='text' 
                                className="range_input" 
                                placeholder="Max" 
                                value={maxMessageSent} 
                                onChange={handleChangeMaxMessageSent}
                            />
                        </div>
                    </div>
                </Col>
                <Col className='mt-4'>
                    <h4>Message Recived:</h4>
                    <div className="range_input_container">
                        <div>
                            <label>Min</label>
                            <input 
                                type='text' 
                                className="range_input" 
                                placeholder="Min" 
                                value={minMessageRiceved} 
                                onChange={handleChangeMinMessageRecv}
                            />
                        </div>
                        <div>
                            <label>Max</label>
                            <input 
                                type='text' 
                                className="range_input" 
                                placeholder="Max" 
                                value={maxMessageRiceved} 
                                onChange={handleChangeMaxMessageRecv}
                            />
                        </div>
                    </div>
                </Col>
                <div className="d-grid gap-2 mt-4">
                    <Button variant="success" size="lg" type="submit">
                        Save filters
                    </Button>
                
                </div>
        </form>
    )
}