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


export const STORAGE_KEY = "appConfig";

export const useConfig = () =>
    useQuery<Config, Error>({
        queryKey: ["config"],
        queryFn: async () => {
            try {
                const raw = sessionStorage.getItem(STORAGE_KEY);
                if (raw) {
                    return JSON.parse(raw) as Config;
                }
            } catch {

            }

            const res = await api.get<Config>("config.json");
            const data = ((res as any)?.data ?? res) as Config;

            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch {

            }

            return data;
        },

        staleTime: Infinity,

    });

