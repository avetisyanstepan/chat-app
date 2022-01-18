import React, { useCallback, useEffect, useState } from "react";
import * as _ from "lodash";
import { Button, Col, Container, Row } from "react-bootstrap";
import { BsFillPlusCircleFill,BsCheckLg, BsBootstrap } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import { css } from "@emotion/react";
import { BeatLoader, ClipLoader } from "react-spinners";
import { API } from "../API";
import { EndPoints } from "../consts";
import { ContactProps, TagsProps } from "../types";
import { FilterTab } from "../components/FilterTab";

import { Contact } from "../components/Contact";




const override = css`
    display: block;
    margin: 136px auto;
`;

const Contacts = () => {
    const [contactsData, setContactsData] = useState<ContactProps[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [tags, setTags] = useState<TagsProps[]>([]);
    const [nextPage, setNextPage] = useState<string>('');
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [messagesQuery, setMessagesQuery] = useState<string[]>([])

    const getAllTags = async () => {
        try {
            const res = await API.get(EndPoints.GetTags);
            setTags(res.data.tags);
        } catch(error) {
            console.log(error);
        }
    };
    
    const getContacts = async (query: string): Promise<void> => {
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
                                    <h3>Audience</h3>
                                </Col>
                            </Row>
                            <FilterTab getContacts={getContacts} getAllTags={getAllTags}/>
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
                                        <Contact contact={contact}  />
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

export default Contacts;