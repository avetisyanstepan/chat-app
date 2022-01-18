
export interface TagsProps {
    name: string
}

export interface ContactProps {
    name: string
    phoneNumber: string
    img?: string
    tags: TagsProps[]
}

