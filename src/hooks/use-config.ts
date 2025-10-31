/*
 * *
 *  * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *  *
 *  * WSO2 LLC. licenses this file to you under the Apache License,
 *  * Version 2.0 (the "License"); you may not use this file except
 *  * in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing,
 *  * software distributed under the License is distributed on an
 *  * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  * KIND, either express or implied. See the License for the
 *  * specific language governing permissions and limitations
 *  * under the License.
 *
 */


import { useQuery} from "@tanstack/react-query";
import type { Config } from "./config-interfaces";
import { api } from "../utility/api";


// const fetchingConfig = async ():Promise<Config> => {
//     const res = await api.get<Config>('/config.js') as Config;
//     console.log(res)
//     return res;
// }


// const mutation = useMutation({
//     mutationFn: async () => {


//     },

//     onSuccess: (data) => {
//         console.log("data", data);
//     }
// })


const STORAGE_KEY = "appConfig";

export const useConfig = () =>
    useQuery<Config, Error>({
        queryKey: ["config"],
        queryFn: async () => {
            // Try session cache first
            try {
                const raw = sessionStorage.getItem(STORAGE_KEY);
                if (raw) {
                    return JSON.parse(raw) as Config;
                }
            } catch {
                // ignore parse/storage errors and fall back to network
            }

            // Fetch from network. Support both axios-like and fetch-like api.get.
            const res = await api.get<Config>("config.json");
            // res may be either the fetched object itself (fetch-like) or an axios-like response containing a `data` property.
            const data = ((res as any)?.data ?? res) as Config;

            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch {
                // ignore storage errors
            }

            return data;
        },
        onError: (err: any) => {
            console.error("Failed to load config.json", err);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30, // 30 minutes
    });

export default useConfig;

// export const useConfig = () =>
//     useQuery({
//         queryKey: ['config'],
//         queryFn: async () => {
//             const res = await fetch('/configurations/config.json')
//             if (!res.ok) {
//                 console.error('❌ Config fetch failed', res.status)
//                 throw new Error('Failed to fetch config.json')
//             }
//             const data = await res.json()
//             console.log('✅ Config fetched:', data)
//             return data
//         },
//     })
