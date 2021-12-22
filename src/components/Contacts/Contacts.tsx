import { useCallback, useEffect, useState } from "react";
import * as _ from "lodash";
import { Button, Col, Container, Row } from "react-bootstrap";
import { BsFillPlusCircleFill,BsCheckLg, BsBootstrap } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import { css } from "@emotion/react";
import { BeatLoader, ClipLoader } from "react-spinners";
import { API } from "../../API";
import { EndPoints } from "../../consts";
import { CheckBox } from "../UI/Checkbox";
import { ContactProps, TagsProps } from "../../types";


const override = css`
    display: block;
    margin: 136px auto;
`;

const Contacts = () => {

    const [contactsData, setContactsData] = useState<ContactProps []>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [tags, setTags] = useState<TagsProps []>([]);
    const [selectedTags, setSelectedTags] = useState<string []>([]);
    const [excludeTags, setExcludeTags] = useState<string []>([]);
    const [nextPage, setNextPage] = useState<string>('');
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [messagesQuery, setMessagesQuery] = useState<string []>([])
    const [minMessageSent, setMinMessageSent] = useState<number>(0);
    const [maxMessageSent, setMaxMessageSent] = useState<number>(0);
    const [minMessageRiceved, setMinMessageRiceved] = useState<number>(0);
    const [maxMessageRiceved, setMaxMessageRiceved] = useState<number>(0);

    const getAllTags = async () => {
        try {
            const res = await API.get(EndPoints.GetTags)
            setTags(res.data.tags);
        } catch(error) {
            console.log(error);
        }
    };
    
    const getContacts = async (query: any): Promise<void> => {
        setLoading(true);
        try {
            const res = await API.get(EndPoints.Contacts(query));
            setHasMore(true);
            setLoading(false);
            setNextPage(res.data.nextPage);
            setContactsData(res.data.contacts);
          
        } catch(error) {
            console.log(error);
            setLoading(false);

        }
    };

    const handleNextPage = async (query:string) => {
        try {
            const res = await API.get(EndPoints.Contacts(query));
            setHasMore(true);
            setContactsData( s => [...s,...res.data.contacts]);
        } catch(error) {
            console.log(error)
        }
    };

    const handleSelectedTags = (e:any) => {
        if(!selectedTags.includes(e.target.value)) {
            setSelectedTags([...selectedTags,e.target.value]);
        } else {
            setSelectedTags(selectedTags.filter((name:string) => name !== e.target.value));
        }
    };

    const handleExcludeSelectedTags = (e:any) => {
        if(!excludeTags.includes(e.target.value)) {
            setExcludeTags([...excludeTags,e.target.value]);
        } else {
            setExcludeTags(excludeTags.filter((name:string) => name !== e.target.value));
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

    const handelSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault()
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


    const debouncedRequest = useCallback(_.debounce((searchValue: string) => {
        getContacts(`q=${searchValue}`)
    }, 600), []);

    useEffect(() => {
        if(searchValue) {
            debouncedRequest(searchValue);
        }
    }, [searchValue]);
 
    useEffect(() => {
        getContacts('')
        getAllTags()
    }, []);

    return (
            <Container className="mt-4">
                <Row>
                    <Col lg={4}>
                      
                        <Container>
                            <a href='/'>
                                <BsBootstrap  size={32}/>
                            </a>
                            <Row>
                                <Col>
                                    <h3>
                                        Audience
                                    </h3>
                                </Col>
                            </Row>
                            <form onSubmit={handelSubmit}>
                                <Col className='mt-4'>
                                    <h4>Include Tags:</h4>
                                    <div className="d-grid gap-2">                                        
                                    {
                                            tags.length > 0 
                                            ?
                                                tags.map((tag, i) =>  (
                                                    <Button 
                                                        key={`${tag.name}+${i}`}
                                                        variant={selectedTags.includes(tag.name) ? "success" : "outline-success"} 
                                                        size={"sm"} 
                                                        value={tag.name} 
                                                        onClick={handleSelectedTags}
                                                        className="position-relative"
                                                    >
                                                        {tag.name}
                                                        {selectedTags.includes(tag.name) &&  
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
                                    <h4>Eclude Tags:</h4>
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
                        </Container>
                    </Col>
                    <Col lg={8}>
                    <div className="contacts_container">
                            <div className="contacts_header">
                                <div className="">
                                    <h3>
                                        All Contacts ({contactsData.length})
                                    </h3>
                                </div>
                                <div>
                                    <BsFillPlusCircleFill  
                                        color="#198754"
                                        size={24}
                                        onClick={() => {}}
                                    />
                                </div>
                            </div>
                            <input  
                                type="search" 
                                className="search_contact" 
                                placeholder="Search contacts"
                                onChange={(e) => setSearchValue(e.target.value)}
                                value={searchValue}
                                
                            />
                            <InfiniteScroll
                               dataLength={contactsData.length}
                               next={() => nextPage !== '' && handleNextPage(`page=${nextPage}`)}
                               hasMore={hasMore}
                               loader={<BeatLoader color={"#198754"} loading={loading}  size={18} />}
                               endMessage={
                                 <p style={{ textAlign: 'center' }}>
                                   <b>Yay! You have seen it all</b>
                                 </p>
                               }
                            >
                                { contactsData.length > 0 ?
                                    contactsData.map((contact, i) => (
                                    <div className="contact_info_container" key={i}>
                                        <div className="contact_info_left_side">
                                            <CheckBox />
                                            {contact.img 
                                            ?
                                                <img src='' className="img_container" />  
                                            :   
                                                <div className="no_picture_container"></div>    
                                            }
                                            <div className="name_phoneNumber_container">
                                                <span>
                                                    {contact.name}
                                                </span>
                                                <span>
                                                    +{contact.phoneNumber}
                                                </span>
                                            </div>  
                                        
                                            
                                        </div>    
                                        <div>
                                            {
                                                contact.tags.length > 0  &&
                                                <button className="tags_container">
                                                    Tags 
                                                    <BsFillPlusCircleFill  
                                                        className="tags_plus_container"
                                                        color="white"
                                                        size={14}
                                                        onClick={() => {}}
                                                    />
                                                </button>
                                            }  
                                            <BsFillPlusCircleFill  
                                                color="#198754"
                                                size={24}
                                                onClick={() => {}}
                                            />
                                        </div>    
                                    </div>   
                                    ))
                                    :
                                    <div>{!loading && <span>Not found...</span>}</div>
                                }
                            </InfiniteScroll>
                        </div>
                    </Col>
                </Row>
            </Container>
    )
}

export default Contacts