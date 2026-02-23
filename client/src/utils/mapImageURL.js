import { baseUrl } from "../app/shared/baseUrl";

export const mapImageURL = (arr) => {
    return arr.map((item) => {
        if (!item.image) {
            return item;
        }

        if (item.image.startsWith('data:image')) {
            return item;
        }

        if (item.image.startsWith('http')) {
            return item;
        }
        
        return {
            ...item,
            image: baseUrl + item.image
        };
    });
};