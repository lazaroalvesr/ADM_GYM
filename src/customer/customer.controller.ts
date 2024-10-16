import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from '../dto/customer/CreateCustomerDTO';
import { UpdateCustomerDTO } from '../dto/customer/UpdateCustomerDTO';
import { Public } from '../lib/public.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '../dto/swagger/global/badreques.swagger';
import { CustomersSwaggerAll } from '../dto/swagger/customer/getAllCustomer.swagger';
import { UpdateCustomerSwagger } from '../dto/swagger/customer/UpdateCustomer.swagger';
import { CustomerSwagger } from '../dto/swagger/customer/customers.swagger';

@Controller('customer')
@ApiTags("Clientes")
export class CustomerController {
    constructor(private customerService: CustomerService) { }

    @Post("create")
    @ApiOperation({ summary: 'Criar cliente' })
    @ApiResponse({
        status: 201,
        description: "Cliente cadastrado com sucesso",
        type: CustomerSwagger
    })
    @ApiResponse({
        status: 400,
        description: "Email ja em uso!",
        type: BadRequestSwagger
    })
    @Public()
    create(@Body() customerCreate: CreateCustomerDTO) {
        return this.customerService.create(customerCreate)
    }


    @Get("getAll")
    @ApiOperation({ summary: 'Exibir todos os clientes' })
    @ApiResponse({
        status: 201,
        description: "Dados dos clientes retornado com sucesso!",
        type: [CustomersSwaggerAll]
    })
    @ApiResponse({
        status: 400,
        description: "Erro ao exibir as informações!",
        type: BadRequestSwagger
    })
    getAll() {
        return this.customerService.getAll()
    }

    @Get("getEmail/:email")
    @ApiOperation({ summary: 'Exibir informações de um cliente por email' })
    @ApiResponse({
        status: 201,
        description: "Dados de um cliente retornado com sucesso!",
        type: CustomersSwaggerAll
    })
    @ApiResponse({
        status: 400,
        description: "Erro ao exibir as informações!",
        type: BadRequestSwagger
    })
    getByEmail(@Param("email") email: string) {
        return this.customerService.findByEmail(email)
    }

    @Get("getById/:id")
    @ApiOperation({ summary: 'Exibir informações de um cliente por ID' })
    @ApiResponse({
        status: 201,
        description: "Dados de um cliente retornado com sucesso!",
        type: CustomersSwaggerAll
    })
    @ApiResponse({
        status: 400,
        description: "Erro ao exibir as informações!",
        type: BadRequestSwagger
    })
    getById(@Param("id") id: string) {
        return this.customerService.getById(id)
    }

    @Put(":id")
    @ApiOperation({ summary: 'Atualizar status do pagamento do cliente' })
    @ApiResponse({
        status: 201,
        description: "Dados do cliente atualizados com sucesso!",
        type: UpdateCustomerSwagger
    })
    @ApiResponse({
        status: 400,
        description: "Cliente não foi encontrado!",
        type: BadRequestSwagger
    })
    @ApiBody({
        description: 'Dados a serem atualizados.',
        type: CustomerSwagger,
        examples: {
            example1: {
                summary: 'Exemplo para atualizar clientes',
                value: {
                    startDate: '2024-10-15T00:00:00Z',
                    subscriptionStatusId: 'id do status',
                },
            },
        },
    })
    updateCustomer(@Param("id") id: string, @Body() UpdateCustomerDTO: UpdateCustomerDTO) {
        return this.customerService.updateCustomerStatus(id, UpdateCustomerDTO);
    }


    @Delete("delete/:id")
    @ApiOperation({ summary: 'Remover um cliente' })
    @ApiResponse({
        status: 201,
        description: "Cliente removido com sucesso!",
        type: UpdateCustomerSwagger
    })
    @ApiResponse({
        status: 400,
        description: "Cliente não foi encontrado!",
        type: BadRequestSwagger
    })
    deleteCustomer(@Param("id") id: string) {
        return this.customerService.deleteCustomer(id)
    }
}
