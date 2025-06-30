/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { FastifyRequest, FastifyReply } from 'fastify';
import { ExpenseService } from '../service/ExpenseService';
import { CreateExpenseRequestSchema } from '@features/expense/presentation/payload/CreateExpenseRequest';
import { UpdateExpenseRequestSchema } from '@features/expense/presentation/payload/UpdateExpenseRequest';
import { ExpenseListRequestSchema } from '@features/expense/presentation/payload/ExpenseListRequest';
import { zParse } from '@core/utils/utils';
import { ExpenseFilterRequestSchema } from '@features/expense/presentation/payload/ExpenseFilterRequest';
import { ExpenseStatsRequestSchema } from '@features/expense/presentation/payload/ExpenseStatsRequest';
import { FileStorageService } from '@core/services/FileStorageService';
import path from 'path';
import fs from 'fs/promises';
import { RejectExpenseRequestSchema } from '@features/expense/presentation/payload/RejectExpenseRequest';
import { ValidateExpenseRequestSchema } from '@features/expense/presentation/payload/ValidateExpenseRequest';
import { UpdateSalaryAdvanceStatusRequestSchema } from '@features/salary/presentation/payload/UpdateSalaryAdvanceStatusRequest';

export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  async createExpense(request: FastifyRequest, reply: FastifyReply) {
    const body = await zParse(request, CreateExpenseRequestSchema);
    const result = await this.expenseService.createExpense(body);
    return reply.code(201).send(result);
  }

  async getExpenseById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await this.expenseService.getExpenseById(id);
    if (!result)
      return reply.code(404).send({ message: 'Dépense non trouvée' });
    return reply.send(result);
  }

  async getPaginatedExpenses(request: FastifyRequest, reply: FastifyReply) {
    const query = await zParse(request, ExpenseListRequestSchema);
    const result = await this.expenseService.getPaginatedExpenses(query);
    return reply.send(result);
  }

  async updateExpense(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = await zParse(request, UpdateExpenseRequestSchema);
    const result = await this.expenseService.updateExpense(id, body);
    return reply.send(result);
  }

  async deleteExpense(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await this.expenseService.deleteExpense(id);
    return reply.code(204).send();
  }

  async filterExpenses(request: FastifyRequest, reply: FastifyReply) {
    const filters = await zParse(request, ExpenseFilterRequestSchema);
    const result = await this.expenseService.filterExpenses(filters);
    return reply.send(result);
  }

  async getStatistics(request: FastifyRequest, reply: FastifyReply) {
    const { year } = await zParse(request, ExpenseStatsRequestSchema);
    const result = await this.expenseService.getStatistics(year);
    return reply.send(result);
  }

  async uploadPieceJustificative(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const file = await req.file();

    if (!file) {
      return reply.code(400).send({ message: 'Fichier manquant' });
    }

    const ext = path.extname(file.filename);
    const storedPath = await FileStorageService.saveExpenseFile(
      file,
      `${id}${ext}`
    );
    await this.expenseService.updateFileUrl(id, storedPath);

    return reply.send({ fileUrl: storedPath });
  }

  async downloadPieceJustificative(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const expense = await this.expenseService.getExpenseById(id);

    if (!expense || !expense.fileUrl) {
      return res.code(404).send({ message: 'Fichier non trouvé' });
    }

    const filePath = path.join(
      __dirname,
      '../../../../../public',
      expense.fileUrl
    );

    try {
      await fs.access(filePath);
      return res.sendFile(expense.fileUrl.replace('/medias', 'medias'));
    } catch {
      return res
        .code(404)
        .send({ message: 'Fichier introuvable sur le serveur' });
    }
  }

  async updateStatus(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const body = await zParse(req, UpdateSalaryAdvanceStatusRequestSchema);
    const updated = await this.expenseService.updateStatus(id, body.status);
    res.send(updated);
  }

  async validateAsAdmin(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const body = await zParse(req, ValidateExpenseRequestSchema);
    await this.expenseService.validateAsAdmin(id, body.validatorId);
    res.send({ message: 'Dépense validée par l’administrateur' });
  }

  async validateAsSuperAdmin(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const body = await zParse(req, ValidateExpenseRequestSchema);
    await this.expenseService.validateAsSuperAdmin(id, body.validatorId);
    res.send({ message: 'Dépense validée par le super-admin' });
  }

  async reject(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const body = await zParse(req, RejectExpenseRequestSchema);
    await this.expenseService.reject(id, body.reason);
    res.send({ message: 'Dépense rejetée' });
  }
}
