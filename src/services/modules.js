import api from './api';

export const docService = {
    getAll: async (projectId) => {
        const response = await api.get('/documents', { params: { projectId } });
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/documents', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    }
};

export const materialService = {
    getAll: async () => {
        const response = await api.get('/materials');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/materials', data);
        return response.data;
    },
    getTransactions: async (id) => {
        const response = await api.get(`/materials/${id}/transactions`);
        return response.data;
    },
    addTransaction: async (id, data) => {
        const response = await api.post(`/materials/${id}/transactions`, data);
        return response.data;
    }
};

export const equipmentService = {
    getAll: async () => {
        const response = await api.get('/equipment');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/equipment', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/equipment/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/equipment/${id}`);
        return response.data;
    },
    getProjects: async (id) => {
        const response = await api.get(`/equipment/${id}/projects`);
        return response.data;
    },
    assignToProject: async (id, data) => {
        const response = await api.post(`/equipment/${id}/assign`, data);
        return response.data;
    }
};

export const supplierService = {
    getAll: async () => {
        const response = await api.get('/suppliers');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/suppliers', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/suppliers/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/suppliers/${id}`);
        return response.data;
    }
};
