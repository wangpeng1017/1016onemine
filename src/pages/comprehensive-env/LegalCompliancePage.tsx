import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import DocumentManager from '../../components/environmental/DocumentManager';
import { documentService } from '../../services/environmentalMockService';
import type { Document } from '../../types/environmental';

const LegalCompliancePage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    setDocuments(documentService.getAll());
  }, []);

  const handleAdd = (doc: Omit<Document, 'id' | 'uploadDate'>) => {
    const newDoc = documentService.add(doc);
    setDocuments(documentService.getAll());
  };

  const handleDelete = (id: string) => {
    documentService.delete(id);
    setDocuments(documentService.getAll());
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card
        title={
          <span>
            <FileTextOutlined style={{ marginRight: 8 }} />
            合法合规文档管理
          </span>
        }
      >
        <DocumentManager
          documents={documents}
          onAdd={handleAdd}
          onDelete={handleDelete}
          allowedTypes={['approval', 'acceptance']}
        />
      </Card>
    </div>
  );
};

export default LegalCompliancePage;
