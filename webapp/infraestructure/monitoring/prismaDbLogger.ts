import { PrismaClient } from "@prisma/client";

import Logger, { Log } from "../../business/monitoring/logger";

export default class PrismaDbLogger implements Logger {
    readonly prisma: PrismaClient
    readonly source: string

    constructor (source: string) {
        this.prisma = new PrismaClient()
        this.source = source
    }

    async logInfo(log: Log): Promise<void> {
        try {
            await this.prisma.$connect()
            const now = new Date();
            await this.prisma.logs.create({
                data: {
                    source: this.source,
                    level: 'info',
                    message: log.message,
                    createdAt: now
                }
            })
        } finally {
            this.prisma.$disconnect()
        } 
    }    
    
    async logError(log: Log): Promise<void> {
        try {
            await this.prisma.$connect()
            const now = new Date();
            await this.prisma.logs.create({
                data: {
                    source: this.source,
                    level: 'error',
                    message: log.message,
                    createdAt: now
                }
            })
        } finally {
            this.prisma.$disconnect()
        }
    }
}