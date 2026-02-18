const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Careers API',
      version: '1.0.0',
      description: 'AI-powered recruitment SaaS platform documentation',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        Application: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            applicationDate: { type: 'string', format: 'date-time' },
            candidateId: { type: 'string' },
            jobId: { type: 'string' },
            responses: { type: 'array', items: { type: 'string' } },
            status: { type: 'string' },
            resume: { type: 'string' },
            aiAnalysis: { $ref: '#/components/schemas/AIAnalysis' }
          }
        },
        AIAnalysis: {
          type: 'object',
          properties: {
            matchPercentage: { type: 'number' },
            strengths: { type: 'array', items: { type: 'string' } },
            weaknesses: { type: 'array', items: { type: 'string' } },
            hiringRecommendation: { type: 'string' },
            feedbackToCandidate: { type: 'string' }
          }
        },
        Job: {
          type: 'object',
          properties: {
            _id: { type: 'string' , example: '65cb4e89f1d2a34567890abc' },
            title: { type: 'string', example: 'Backend Developer' },
            responsibilities: { type: 'string' },
            skillsQualifications: { type: 'string' },
            benefits: { type: 'string' },
            location: { 
              type: 'string', 
              enum: ['Onsite', 'Hybrid', 'Remote'],
              example: 'Remote'
            },
            publishedOn: { type: 'string', format: 'date-time' },
            status: { 
              type: 'string', 
              enum: ['Draft', 'Published', 'Preselection', 'Hr_validation', 'Selection_test', 'Selection', 'Archived', 'Cancelled', 'Reviewing Applications'],
              default: 'Draft'
            },
            description: { type: 'string' },
            recruiterId: { type: 'string', description: 'Reference to User ID' }
          }
        },
      }
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);
module.exports = { specs };

