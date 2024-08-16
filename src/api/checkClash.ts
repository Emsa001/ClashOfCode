import axios from "axios";
import { Clash } from "../types/clashes";

interface CheckClashProps {
    clash: string;
    cookie: string;
}

async function checkClash({clash,cookie}:CheckClashProps): Promise<Clash> {
    try {
        let data = `["${clash}"]`;

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://www.codingame.com/services/ClashOfCode/findClashReportInfoByHandle",
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
            data: data,
        };

        const response = await axios(config);
        return response.data;
    } catch (error:any) {
        console.log(error);
        return error?.response || error;
    }
}

export default checkClash;
