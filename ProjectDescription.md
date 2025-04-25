Bike Rental Prediction System: Project Description


### 1. Project Overview

The Bike Rental Prediction System is a comprehensive application that predicts bicycle rental demand based on weather conditions, leveraging a pre-trained Random Forest model. The system provides resource management capabilities to optimize worker allocation and bike distribution based on predicted demand. Designed as a standalone demo with future cloud-deployment capabilities, it features an intuitive UI for both predictions and resource management.


### 2. System Architecture

The application follows a classic client-server architecture:

User Interface (Browser)
        ↑↓
React Frontend ([http://localhost:3000](http://localhost:3000))
        ↑↓
Python Flask API ([http://localhost:5000](http://localhost:5000))
        ↑↓
Pre-trained Random Forest Model (.pkl)

This modular design allows for local demonstration while ensuring future scalability to cloud environments.


### 3. Key Components


#### Frontend (React) - IMPLEMENTED

 
- Dashboard: Central hub with summary metrics and visualizations
- Prediction Module: Interactive form for weather parameter inputs
- Worker Management: CRUD interface for staff allocation
- Bike Management: Inventory tracking and distribution system
- Data Visualization: Charts displaying historical and predicted data


#### Backend (Python Flask) - IMPLEMENTED

 
- API Server: Handles requests from frontend and returns predictions
- Model Integration: Loads and applies the pre-trained Random Forest model
- Data Transformer: Processes input data into the format required by the model
- Mock Database: Simulates persistence for demonstration purposes


#### ML Component - IMPLEMENTED

 
- Random Forest Model: Pre-trained regressor with ~86.5% accuracy
- Feature Transformation: Converts raw input into model-ready features
- Scaler: Normalizes numerical features to improve prediction quality


### 4. Component Interactions


#### Prediction Flow

 
- User inputs weather parameters through the React frontend
- Frontend sends HTTP POST request to Flask API
- API transforms data and feeds it to the Random Forest model
- Model generates a rental prediction
- API returns prediction to frontend
- Frontend calculates resource needs based on prediction
- UI displays prediction and resource recommendations


#### Resource Management Flow

 
- Users view current resource allocation on Dashboard
- Add/Edit/Delete workers or bikes through management interfaces
- Changes stored in localStorage (demo) or database (production)
- System automatically recalculates optimal distribution based on predictions


### 5. Technical Stack

Frontend: React, Recharts, Tailwind CSS, Axios
Backend: Flask, Flask-CORS, Pandas
ML: Scikit-learn (Random Forest), Joblib
Development Tools: Node.js, npm, Python virtualenv
Data Format: JSON for API communication


### 6. Current Implementation Status

- Project Setup: COMPLETED
- Backend Development (Flask MimicAPI): COMPLETED
- Frontend Development (React): COMPLETED
- Integration Features: COMPLETED
- Testing and Quality Assurance: IN PROGRESS
- Documentation and Finalization: COMPLETED
- Future Considerations: PLANNED


### 7. Testing Status (In Progress)

- Unit tests for backend transformations
- Frontend component testing
- Integration tests for prediction flow
- LocalStorage persistence functionality validation
- Error handling and fallback mechanisms verification
- Cross-browser compatibility testing
- Usability testing of prediction and management interfaces


Bike Rental Prediction System: MimicAPI Demo Implementation


### Demo Overview

The MimicAPI demonstration version of the Bike Rental Prediction System provides a fully functional local experience without requiring cloud infrastructure or complex setup. This self-contained demo showcases the system's capabilities by simulating real-world API behavior and machine learning predictions on a single machine.


### MimicAPI Functionality

The MimicAPI serves as a lightweight backend substitute that:

- Loads the actual pre-trained Random Forest model (.pkl file) locally
- Processes weather parameters through the same transformation pipeline as production
- Generates authentic predictions based on the real ML model
- Simulates API response timing to replicate real-world latency
- Provides mock historical data for visualization components
- Maintains temporary storage of worker and bike resources during the demo session


### Local Demonstration Setup

The demonstration runs entirely on a single computer with:

- React frontend ([http://localhost:3000](http://localhost:3000)) - handles user interface and visualization
- Python Flask server ([http://localhost:5000](http://localhost:5000)) - serves as the MimicAPI
- Pre-trained model file loaded directly by the Flask server

This configuration eliminates cloud dependencies while preserving the full user experience.


### Key Demo Features

- Zero-configuration ML integration: The system automatically loads the Random Forest model if available, or falls back to a simple algorithm if missing
- Realistic data persistence: Changes to worker and bike data persist within the browser session
- Cross-origin support: Built-in CORS handling enables seamless frontend-backend communication
- Error resilience: Graceful fallbacks for missing model files or prediction errors
- Realistic timing: Simulated network delays create authentic user experience


### User Interaction Flow

- User opens the application in their browser at [http://localhost:3000](http://localhost:3000)
- They input weather parameters (temperature, humidity, etc.)
- The frontend sends this data to the local MimicAPI
- The MimicAPI processes the request through the actual ML model
- A prediction is generated and returned to the frontend
- The UI updates with the prediction and resource recommendations
- User can manage workers and bikes through the interface, with changes persisting during the session


### Technical Implementation

The MimicAPI is implemented as a Flask application that:

```python
# Automatically loads the ML model or provides a fallback
try:
    model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    class DummyModel:
        def predict(self, X):
            return [np.random.randint(100, 500)]
    model = DummyModel()
```

The frontend connects to this local API just as it would to a production endpoint:

```javascript
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
});
```

### Advantages for Demonstration

- Authentic user experience: Produces real ML-based predictions
- No internet required: Can be demonstrated offline
- Simple setup: Minimal dependencies for presenters or stakeholders
- Fast iteration: Rapid changes can be implemented and tested
- Realistic performance: Shows actual model prediction quality
- Easy transition: Same API contract as future production implementation

This demonstration configuration provides stakeholders with a realistic preview of the system's capabilities without the complexities of cloud deployment, while maintaining a clear path to future production implementation.


一、项目整体架构图

用户界面 (浏览器)
     ↑↓
React前端应用 ([http://localhost:3000](http://localhost:3000))
     ↑↓
Python模拟API服务 ([http://localhost:5000](http://localhost:5000))
     ↑↓
预训练随机森林模型文件 (.pkl)

二、完整项目目录结构

bike-rental-system/
├── frontend/                  # React前端应用
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/        # UI组件
│   │   │   ├── BikeRentalSystem.jsx       # 主应用组件
│   │   │   ├── Dashboard.jsx              # 仪表盘
│   │   │   ├── PredictionForm.jsx         # 预测表单
│   │   │   ├── WorkerManagement.jsx       # 工作人员管理
│   │   │   └── BikeManagement.jsx         # 自行车管理
│   │   ├── services/
│   │   │   ├── api.js         # API通信层
│   │   │   └── mockData.js    # 本地模拟数据
│   │   ├── hooks/
│   │   │   └── usePrediction.js  # 自定义hooks
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.development       # 开发环境变量
│   ├── package.json
│   └── README.md
│
├── api/                       # Python模拟API服务
│   ├── model/
│   │   ├── random_forest_model.pkl  # 预训练随机森林模型
│   │   └── scaler.pkl               # 特征缩放器
│   ├── app.py                 # Flask API主程序
│   ├── requirements.txt       # Python依赖
│   └── README.md
│
├── ModelCreate/               # 模型创建和测试工具
│   ├── data/                  # 训练数据
│   ├── save_model_RandomForest.py   # 模型训练脚本
│   └── use_model.py           # 模型测试脚本
│
└── README.md                  # 项目说明文档
