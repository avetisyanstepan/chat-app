import { BsFillPlusCircleFill } from "react-icons/bs"
import { ContactProps } from "../../types"
import { CheckBox } from "../UI/Checkbox"

interface Contact  {
    contact: ContactProps
}

export const Contact:React.FC<Contact> = ({contact}) => {

    return(
        <div className="contact_info_container">
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
    )
}