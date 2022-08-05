import { User } from "@models/User";
import * as express from "express";

export interface ApiRequest extends express.Request{
    user: User
}