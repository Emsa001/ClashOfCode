import axios from "axios";

interface CreateClashProps {
    clash: string;
    cookie: string;
}

async function startClash({ clash, cookie }: CreateClashProps) {
    try {
        const userId = cookie.slice(0,7);

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://www.codingame.com/services/ClashOfCode/startClashByHandle",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0",
                Accept: "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Content-Type": "application/json;charset=utf-8",
                Origin: "https://www.codingame.com",
                Connection: "keep-alive",
                Referer: "https://www.codingame.com/multiplayer/clashofcode",
                Cookie: `rememberMe=${cookie}`,
            },
            data: `[${userId},"${clash}"]`,
        };

        const response = await axios(config);
        return response;
    } catch (error: any) {
        return error?.response || error;
    }
}

export default startClash;
