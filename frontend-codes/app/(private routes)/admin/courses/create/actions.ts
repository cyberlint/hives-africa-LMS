"use server";

import { requireAdmin } from "@/lib/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { error } from "console";

type CourseStatus = "InReview" | "Published" | "Archived" | "Draft";


const aj = arcjet
    .withRule(
        detectBot({
            mode: "LIVE",
            allow: [],    //List of bots allowed to interact with your route handler. E.g OpenAI
        })
    )
    .withRule(
        fixedWindow({
            mode: "LIVE",   //// Allows up to 10 file uploads in a 1 minute window. Adjust as needed.
            window: "1m",
            max: 10,
        })
    );

export async function CreateCourse(values: CourseSchemaType
): Promise<ApiResponse> {
    const session = await requireAdmin();
    try {
        const req = await request()
        const decision = await aj.protect(req, {
            fingerprint: session.user.id,
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "You have been blocked due to rate limiting",
                };
            } else {
                return {
                    status: "error",
                    message: "You are a bot. If this is a mistake, please contact support",
                };
            }
        }

        const validation = courseSchema.safeParse(values);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid Form Data",
            };
        }

        const data = await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string,
            },
        });

        return {
            status: 'success',
            message: "Course created succesfully",
        }
    } catch (error) {
        console.log(error)
        return {
            status: "error",
            message: "Failed to create course"
        }
    }

}
