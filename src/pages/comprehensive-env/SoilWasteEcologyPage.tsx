import React, { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import DocumentManager from '../../components/environmental/DocumentManager';
import { documentService, detectionReportService } from '../../services/environmentalMockService';
import type { Document } from '../../types/environmental';

const SoilWasteEcologyPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    setDocuments(documentService.getAll().filter(d => ['soil', 'solid_waste', 'ecology'].includes(d.type)));
  }, []);

  const handleAdd = (doc: Omit<Document, 'id' | 'uploadDate'>) => {
    documentService.add(doc);
    setDocuments(documentService.getAll().filter(d => ['soil', 'solid_waste', 'ecology'].includes(d.type)));
  };

  const handleDelete = (id: string) => {
    documentService.delete(id);
    setDocuments(documentService.getAll().filter(d => ['soil', 'solid_waste', 'ecology'].includes(d.type)));
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card title={<span><ExperimentOutlined style={{ marginRight: 8 }} />土壤、固废、生态管理</span>}>
        <Tabs
          items={[
            {
              key: 'soil',
              label: '土壤检测',
              children: (
                <DocumentManager
                  documents={documents.filter(d => d.type === 'soil')}
                  onAdd={(doc) => handleAdd({ ...doc, type: 'soil' })}
                  onDelete={handleDelete}
                  allowedTypes={['soil']}
                />
              )
            },
            {
              key: 'waste',
              label: '固废检测',
              children: (
                <DocumentManager
                  documents={documents.filter(d => d.type === 'solid_waste')}
                  onAdd={(doc) => handleAdd({ ...doc, type: 'solid_waste' })}
                  onDelete={handleDelete}
                  allowedTypes={['solid_waste']}
                />
              )
            },
            {
              key: 'ecology',
              label: '生态检测',
              children: (
                <DocumentManager
                  documents={documents.filter(d => d.type === 'ecology')}
                  onAdd={(doc) => handleAdd({ ...doc, type: 'ecology' })}
                  onDelete={handleDelete}
                  allowedTypes={['ecology']}
                />
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default SoilWasteEcologyPage;
