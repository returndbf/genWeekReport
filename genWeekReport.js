
import dayjs from "dayjs";
export async function genWeekReport(authorName = "", commitTypes = [], startDate = dayjs().startOf("week").unix(), endDate = dayjs().endOf("week").unix()) {
    if (typeof process !== 'undefined' && process.versions.node) {
        const fs = await import('node:fs');
        const path = await import('node:path');

        function shouldIncludeCommit(commit, authorName, startDate, endDate) {
            const commitTime = dayjs.unix(commit.timestamp);

            if (authorName && commit.authorName !== authorName) {
                return false;
            }

            if (startDate && commitTime.isBefore(dayjs.unix(startDate))) {
                return false;
            }
            if (endDate && commitTime.isAfter(dayjs.unix(endDate))) {
                return false;
            }

            return true;
        }
        function formatMessage(message, commitTypes, index) {
            commitTypes.forEach(type => {
                const prefix = `${type}:`;
                if (message.toLowerCase().startsWith(prefix)) {
                    message = message.slice(prefix.length).trim();
                }
            });

            return `${index}:${message}`;
        }
        const regex = /^(\w+)\s+(\w+)\s+([^\s]+)\s+<([^>]+)>\s+(\d+)\s+([\+\-]\d{4})\s+(.*)$/gm;
        const commits = [];
        const filePath = path.join(process.cwd(), ".git", "logs", "HEAD");
        let resTypes = ['feat', 'fix', 'refactor', 'style', 'docs', 'perf', 'test', 'chore', 'revert', 'merge']
        if (commitTypes && commitTypes.length > 0) {
            resTypes = resTypes.concat(commitTypes)
        }
        try {
            const data = fs.readFileSync(filePath, { encoding: "utf-8" });

            let match;
            while ((match = regex.exec(data)) !== null) {
                // 避免无限循环
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                const message = match[7].replace(/^commit:\s*/, "").trim();
                const commit = {
                    commitHash: match[1],
                    parentCommitHash: match[2],
                    authorName: match[3],
                    authorEmail: match[4],
                    timestamp: parseInt(match[5], 10),
                    timezone: match[6],
                    message: message
                };

                // 提前过滤不符合条件的提交记录
                if (shouldIncludeCommit(commit, authorName, startDate, endDate)) {
                    commits.push(commit);
                }
            }
            return commits.sort((a, b) => a.timestamp - b.timestamp).map((item, index) => formatMessage(item.message, resTypes, index + 1)).join('');

        } catch (error) {
            console.error('An error occurred,idiot:' + error);
            throw error;
        }
    } else {
        return 'genWeekReport only run in nodejs'
    }

}
