import axios from "axios";
import { clashes } from "../startGame";

interface SubmitClashProps {
    clash: string;
    cookie: string;
}

async function startClashTestSession({ clash, cookie }: SubmitClashProps) {
    const userId = cookie.slice(0, 7);
    let data = `[${userId},"${clash}"]`;

    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://www.codingame.com/services/ClashOfCode/startClashTestSession",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0",
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Content-Type": "application/json;charset=utf-8",
            Origin: "https://www.codingame.com",
            Connection: "keep-alive",
            Referer: `https://www.codingame.com/clashofcode/clash/${clash}`,
            Cookie: `rememberMe=${cookie}`,
        },
        data: data,
    };

    try {
        const response = await axios(config);
        return response;
    } catch (error: any) {
        return error?.response;
    }
}

async function submitClash({ clash, cookie }: SubmitClashProps) {
    try {
        const clashObject = clashes.find((c) => c.clash === clash);
        if (!clashObject) throw new Error("Clash not found");

        const testSession = await startClashTestSession({ clash, cookie });
        if (testSession.status !== 200)
            throw new Error(testSession);

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://www.codingame.com/services/TestSession/submit",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json;charset=utf-8",
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                Origin: "https://www.codingame.com",
                Connection: "keep-alive",
                Referer: "https://www.codingame.com/multiplayer/clashofcode",
                Cookie: "rememberMe=622900789ab95cb2fd0175aa177051194f226ad;cgSession=6608a979-e786-46db-9a56-4f2ec52a0f5a;",
                "Content-Length": "456",
            },
            data: `["${testSession.data.handle}",{"code":"/**\\\\n * Auto-generated code below aims at helping you parse\\\\n * the standard input according to the problem statement.\\\\n **/\\\\n\\\\nconst N = parseInt(readline());\\\\nfor (let i = 0; i < N; i++) {\\\\n    const X = parseInt(readline());\\\\n}\\\\n\\\\n// Write an answer using console.log()\\\\n// To debug: console.error('Debug messages...');\\\\n\\\\nconsole.log('answer');\\\\n","programmingLanguageId":"${clashObject.languages[0]}"},null]`,
        };

        const response = await axios.request(config);
        return response;
    } catch (error: any) {
        return error?.response;
    }
}

export default submitClash;
