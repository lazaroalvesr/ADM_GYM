import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateCustomerDTO } from '../dto/customer/CreateCustomerDTO';
import { UpdateCustomerDTO } from '../dto/customer/UpdateCustomerDTO';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomerService {
    constructor(
        private prismaService: PrismaService,
        private readonly configService: ConfigService,
    ) { }

    async create(createCustomer: CreateCustomerDTO) {

        const existingCustomer = await this.prismaService.customer.findUnique({
            where: { email: createCustomer.email },
        });

        if (existingCustomer) {
            throw new BadRequestException("Email already in use");
        }

        const newCustomer = await this.prismaService.customer.create({
            data: {
                name: createCustomer.name,
                email: createCustomer.email,
                telephone: createCustomer.telephone,
                adminId: createCustomer.adminId,
                planId: createCustomer.planId,
                startDate: createCustomer.startDate,
                endDate: createCustomer.endDate,
                subscriptionStatusId: createCustomer.subscriptionStatusId,
            }
        })


        return newCustomer;
    }

    async getAll() {
        const customers = await this.prismaService.customer.findMany({
            include: {
                status: {
                    select: {
                        name: true,
                    },
                },
                plan: {
                    select: {
                        name: true,
                        price: true,
                    },
                },
            },
        });

        return customers.map(customer => ({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            telephone: customer.telephone,
            startDate: customer.startDate,
            endDate: customer.endDate,
            status: customer.status.name,
            plan: {
                name: customer.plan.name,
                price: customer.plan.price,
            },
        }));
    }

    async findByEmail(email: string) {
        const customer = await this.prismaService.customer.findUnique({
            where: { email },
            include: {
                plan: {
                    select: {
                        name: true,
                        price: true,
                    },
                },
                status: {
                    select: {
                        name: true,
                    },
                },
            
            },
        });

        if (!customer) {
            throw new NotFoundException("Customer not found");
        }

        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            telephone: customer.telephone,
            startDate: customer.startDate,
            endDate: customer.endDate,
            status: customer.status?.name,
            plan: {
                name: customer.plan?.name,
                price: customer.plan?.price,
            },
        };
    }

    // async getById(id: string) {

    //     const customer = await this.prismaService.customer.findUnique({
    //         where: { id },
    //         include: {
    //             plan: {
    //                 select: {
    //                     name: true,
    //                     price: true,
    //                 },
    //             },
    //             status: {
    //                 select: {
    //                     name: true,
    //                 },
    //             },
    //         },
    //     });

    //     if (!customer) {
    //         throw new BadRequestException("ID is required!");
    //     }


    //     if (customer) {
    //         return {
    //             id: customer.id,
    //             name: customer.name,
    //             email: customer.email,
    //             telephone: customer.telephone,
    //             startDate: customer.startDate,
    //             endDate: customer.endDate,
    //             status: customer.status?.name,
    //             plan: {
    //                 name: customer.plan?.name,
    //                 price: customer.plan?.price,
    //             },
    //         };
    //     }

    //     return customer;
    // }


    async getById(id: string) {
        const customer = await this.prismaService.customer.findUnique({
            where: { id },
            include: {
                plan: true,  // Include plan if it's related
                status: true, // Include status if it's related
            },
        });
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    
    async updateCustomerStatus(id: string, updateCustomers: UpdateCustomerDTO) {
        if (!id) {
            throw new BadRequestException("ID is required!");
        }
    
        const existingCustomer = await this.prismaService.customer.findUnique({
            where: { id },
            include: {
                plan: true,
            },
        });
    
        if (!existingCustomer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
    
        const activeStatus = this.configService.get<string>('STATUS_ACTIVE');
        const newData = {
            startDate: updateCustomers.startDate,
            subscriptionStatusId: updateCustomers.subscriptionStatusId,
            endDate: updateCustomers.endDate,
        };
    
        if (updateCustomers.subscriptionStatusId === activeStatus) {
            const novaDataVencimento = new Date(existingCustomer.endDate);
            novaDataVencimento.setDate(novaDataVencimento.getDate() + 30);
    
            newData.endDate = novaDataVencimento;
    
            console.log(`Subscription status updated for ${existingCustomer.name}`);
        }
    
        const updatedCustomer = await this.prismaService.customer.update({
            where: { id },
            data: newData,
        });
    
        return updatedCustomer;
    }
    
    async deleteCustomer(id: string) {
        if (!id) {
            throw new BadRequestException("ID is required!");
        }

        const existingCustomer = await this.prismaService.customer.findUnique({
            where: { id },
        });

        if (!existingCustomer) {
            throw new NotFoundException(`Customer with ID not found`);
        }

        const deletedCustomer = await this.prismaService.customer.delete({
            where: { id },
        });

        return deletedCustomer;
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async atualizarStatusAssinatura() {
        const clients = await this.prismaService.customer.findMany();

        const now = new Date();

        const statusExpired = this.configService.get<string>('STATUS_EXPIRED');

        for (const client of clients) {
            const clientEndDate = new Date(client.endDate);

            if (clientEndDate < now) {
                await this.prismaService.customer.update({
                    where: {
                        id: client.id
                    },
                    data: {
                        subscriptionStatusId: statusExpired
                    }
                })
            }
        }
    }

}

