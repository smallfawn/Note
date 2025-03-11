const axios = require('axios');

// GitHub 仓库信息
const REPO_OWNER = 'smallfawn'; // 替换为你的 GitHub 用户名
const REPO_NAME = 'Note'; // 替换为你的仓库名
const WORKFLOW_FILE = 'updateInviteKS.yml'; // 替换为你的 GitHub Action 工作流文件路径

// GitHub 个人访问令牌
const GITHUB_TOKEN = 'your-github-personal-access-token'; // 替换为你的 GitHub 个人访问令牌

// 触发 GitHub Action 的函数
async function triggerGitHubAction() {
    try {
        // 构造 GitHub API URL
        const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_FILE}/dispatches`;

        // 设置请求头
        const headers = {
            Authorization: `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Node.js GitHub Action Trigger'
        };

        // 触发工作流的请求体
        const requestBody = {
            ref: 'main', // 触发的分支，可以替换为你需要的分支
            inputs: {
                // 这里可以添加工作流需要的输入参数
                // 例如：key: 'value'
            }
        };

        // 发送 POST 请求触发 GitHub Action
        const response = await axios.post(apiUrl, requestBody, { headers });

        console.log('GitHub Action 触发成功!');
        console.log('响应数据:', response.data);
    } catch (error) {
        console.error('触发 GitHub Action 失败:', error.response ? error.response.data : error.message);
    }
}

// 执行触发函数
triggerGitHubAction();