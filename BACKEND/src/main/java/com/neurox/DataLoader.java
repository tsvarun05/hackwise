package com.neurox;

import com.neurox.entity.Module;
import com.neurox.entity.Question;
import com.neurox.repository.ModuleRepository;
import com.neurox.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final QuestionRepository questionRepository;
    private final ModuleRepository moduleRepository;

    public DataLoader(QuestionRepository questionRepository, ModuleRepository moduleRepository) {
        this.questionRepository = questionRepository;
        this.moduleRepository = moduleRepository;
    }

    @Override
    public void run(String... args) {
        if (questionRepository.count() == 0) loadQuestions();
        if (moduleRepository.count() == 0) loadModules();
    }

    // ─── QUESTIONS ────────────────────────────────────────────────────────────

    private void loadQuestions() {
        questionRepository.saveAll(Arrays.asList(

            // ── AI domain ──────────────────────────────────────────────────
            q("What does ML stand for in AI?",
                list("Machine Learning", "Model Logic", "Meta Language", "Micro Learning"),
                "Machine Learning", "AI Basics", "ai"),
            q("Which algorithm is used for classification in supervised learning?",
                list("K-Means", "Decision Tree", "DBSCAN", "PCA"),
                "Decision Tree", "AI Basics", "ai"),
            q("What is overfitting in machine learning?",
                list("Model performs well on training but poorly on new data",
                     "Model performs poorly on training data",
                     "Model has too few parameters",
                     "Model trains too slowly"),
                "Model performs well on training but poorly on new data", "ML Concepts", "ai"),
            q("Which Python library is most commonly used for deep learning?",
                list("NumPy", "Pandas", "TensorFlow", "Matplotlib"),
                "TensorFlow", "Deep Learning", "ai"),
            q("What is a neural network?",
                list("A database structure", "A set of algorithms modeled after the human brain",
                     "A type of sorting algorithm", "A network protocol"),
                "A set of algorithms modeled after the human brain", "Deep Learning", "ai"),
            q("What does NLP stand for?",
                list("Natural Language Processing", "Network Layer Protocol",
                     "Neural Learning Program", "Numeric Logic Processing"),
                "Natural Language Processing", "NLP", "ai"),

            // ── Web Development domain ─────────────────────────────────────
            q("What does HTML stand for?",
                list("HyperText Markup Language", "High Transfer Markup Language",
                     "HyperText Machine Language", "None of the above"),
                "HyperText Markup Language", "HTML", "webdev"),
            q("Which CSS property is used to change text color?",
                list("font-color", "text-color", "color", "foreground"),
                "color", "CSS", "webdev"),
            q("What is the correct way to declare a variable in modern JavaScript?",
                list("var x = 5", "let x = 5", "variable x = 5", "int x = 5"),
                "let x = 5", "JavaScript", "webdev"),
            q("What is React?",
                list("A CSS framework", "A JavaScript library for building UIs",
                     "A backend framework", "A database"),
                "A JavaScript library for building UIs", "React", "webdev"),
            q("What does REST stand for in web APIs?",
                list("Representational State Transfer", "Remote Execution Standard Transfer",
                     "Rapid Endpoint Service Technology", "None"),
                "Representational State Transfer", "APIs", "webdev"),
            q("Which HTTP method is used to send data to a server?",
                list("GET", "POST", "DELETE", "HEAD"),
                "POST", "APIs", "webdev"),

            // ── DSA domain ─────────────────────────────────────────────────
            q("What is the time complexity of binary search?",
                list("O(n)", "O(n^2)", "O(log n)", "O(1)"),
                "O(log n)", "Searching", "dsa"),
            q("Which data structure uses LIFO order?",
                list("Queue", "Stack", "LinkedList", "Tree"),
                "Stack", "Stacks", "dsa"),
            q("What is the worst-case time complexity of QuickSort?",
                list("O(n log n)", "O(n)", "O(n^2)", "O(log n)"),
                "O(n^2)", "Sorting", "dsa"),
            q("Which data structure is used for BFS traversal?",
                list("Stack", "Queue", "Array", "Heap"),
                "Queue", "Graphs", "dsa"),
            q("What is a hash table used for?",
                list("Sorting elements", "Fast key-value lookups", "Tree traversal", "Graph search"),
                "Fast key-value lookups", "Hashing", "dsa"),
            q("What is the height of a balanced binary tree with n nodes?",
                list("O(n)", "O(n^2)", "O(log n)", "O(1)"),
                "O(log n)", "Trees", "dsa"),

            // ── Cloud Computing domain ─────────────────────────────────────
            q("What does IaaS stand for?",
                list("Infrastructure as a Service", "Internet as a Service",
                     "Integration as a Service", "None"),
                "Infrastructure as a Service", "Cloud Models", "cloud"),
            q("Which AWS service is used for object storage?",
                list("EC2", "RDS", "S3", "Lambda"),
                "S3", "AWS", "cloud"),
            q("What is auto-scaling in cloud computing?",
                list("Automatically adjusting compute resources based on demand",
                     "Scaling a database manually",
                     "Increasing storage permanently",
                     "None of the above"),
                "Automatically adjusting compute resources based on demand", "Scalability", "cloud"),
            q("What is a container in cloud computing?",
                list("A virtual machine", "A lightweight isolated runtime environment",
                     "A type of database", "A network switch"),
                "A lightweight isolated runtime environment", "Containers", "cloud"),
            q("Which tool is used for container orchestration?",
                list("Docker", "Kubernetes", "Ansible", "Terraform"),
                "Kubernetes", "Containers", "cloud"),
            q("What does CDN stand for?",
                list("Content Delivery Network", "Central Data Node",
                     "Cloud Distribution Network", "None"),
                "Content Delivery Network", "Networking", "cloud"),

            // ── Cybersecurity domain ───────────────────────────────────────
            q("What is a firewall?",
                list("A type of virus", "A network security system that monitors traffic",
                     "An encryption algorithm", "A VPN protocol"),
                "A network security system that monitors traffic", "Network Security", "cybersec"),
            q("What does SQL injection exploit?",
                list("Weak passwords", "Unsanitized database queries",
                     "Open ports", "Outdated SSL certificates"),
                "Unsanitized database queries", "Web Security", "cybersec"),
            q("What is phishing?",
                list("A type of malware", "Tricking users into revealing sensitive info",
                     "A network scanning technique", "A DDoS attack"),
                "Tricking users into revealing sensitive info", "Social Engineering", "cybersec"),
            q("What does HTTPS provide over HTTP?",
                list("Faster speed", "Encrypted communication", "Better caching", "Larger payloads"),
                "Encrypted communication", "Encryption", "cybersec"),
            q("What is a zero-day vulnerability?",
                list("A bug fixed on day zero", "An unknown vulnerability with no patch yet",
                     "A vulnerability in old software", "A type of DDoS"),
                "An unknown vulnerability with no patch yet", "Vulnerabilities", "cybersec"),
            q("What is the purpose of a VPN?",
                list("Speed up internet", "Encrypt and tunnel internet traffic",
                     "Block ads", "Scan for viruses"),
                "Encrypt and tunnel internet traffic", "Network Security", "cybersec"),

            // ── Data Science domain ────────────────────────────────────────
            q("Which Python library is used for data manipulation?",
                list("NumPy", "Pandas", "Matplotlib", "Scikit-learn"),
                "Pandas", "Python", "datascience"),
            q("What is a DataFrame?",
                list("A type of chart", "A 2D labeled data structure in Pandas",
                     "A machine learning model", "A database table"),
                "A 2D labeled data structure in Pandas", "Python", "datascience"),
            q("What does EDA stand for?",
                list("Exploratory Data Analysis", "Extended Data Algorithm",
                     "Encoded Data Array", "None"),
                "Exploratory Data Analysis", "Data Analysis", "datascience"),
            q("Which chart is best for showing distribution of a single variable?",
                list("Bar chart", "Pie chart", "Histogram", "Line chart"),
                "Histogram", "Visualization", "datascience"),
            q("What is the purpose of normalization in data preprocessing?",
                list("Remove duplicates", "Scale features to a common range",
                     "Fill missing values", "Encode categories"),
                "Scale features to a common range", "Data Preprocessing", "datascience"),
            q("What is a correlation coefficient?",
                list("A measure of data spread", "A measure of linear relationship between two variables",
                     "A type of regression", "A clustering metric"),
                "A measure of linear relationship between two variables", "Statistics", "datascience")
        ));
    }

    // ─── MODULES ──────────────────────────────────────────────────────────────

    private void loadModules() {
        moduleRepository.saveAll(Arrays.asList(

            // ── AI modules ─────────────────────────────────────────────────
            m("What is Machine Learning?",              "AI Basics",    "https://www.youtube.com/watch?v=ukzFI9rgwfU",  1, "ai", 12,  "beginner"),
            m("Supervised vs Unsupervised Learning",    "ML Concepts",  "https://www.youtube.com/watch?v=1FZ0A1QCMWc",  2, "ai", 15,  "beginner"),
            m("Neural Networks Explained Visually",     "Deep Learning","https://www.youtube.com/watch?v=aircAruvnKk",  3, "ai", 19,  "intermediate"),
            m("How Neural Networks Learn",              "Deep Learning","https://www.youtube.com/watch?v=IHZwWFHWa-w",  4, "ai", 21,  "intermediate"),
            m("Overfitting & Model Evaluation",         "ML Concepts",  "https://www.youtube.com/watch?v=EuBBz3bI-aA",  5, "ai", 10,  "intermediate"),
            m("NLP Explained",                          "NLP",          "https://www.youtube.com/watch?v=fOvTtapxa9c",  6, "ai", 14,  "advanced"),

            // ── Web Development modules ────────────────────────────────────
            m("HTML in 100 Seconds",                   "HTML",         "https://www.youtube.com/watch?v=ok-plXXHlWw",  1, "webdev", 2,  "beginner"),
            m("CSS in 100 Seconds",                    "CSS",          "https://www.youtube.com/watch?v=OEV8gMkCHXQ",  2, "webdev", 2,  "beginner"),
            m("JavaScript in 100 Seconds",             "JavaScript",   "https://www.youtube.com/watch?v=DHjqpvDnNGE",  3, "webdev", 2,  "beginner"),
            m("React in 100 Seconds",                  "React",        "https://www.youtube.com/watch?v=Tn6-PIqc4UM",  4, "webdev", 2,  "intermediate"),
            m("REST APIs Explained in 5 Minutes",      "APIs",         "https://www.youtube.com/watch?v=SLwpqD8n3d0",  5, "webdev", 5,  "intermediate"),
            m("HTTP & Status Codes Explained",         "APIs",         "https://www.youtube.com/watch?v=iYM2zFP3Zn0",  6, "webdev", 40, "intermediate"),

            // ── DSA modules ────────────────────────────────────────────────
            m("Big O Notation & Time Complexity",      "Searching",    "https://www.youtube.com/watch?v=D6xkbGLQesk",  1, "dsa", 18, "beginner"),
            m("Stack Data Structure Explained",        "Stacks",       "https://www.youtube.com/watch?v=wjI1WNcIntg",  2, "dsa", 10, "beginner"),
            m("Sorting Algorithms Visualized",         "Sorting",      "https://www.youtube.com/watch?v=kgBjXUE_Nwc",  3, "dsa", 12, "intermediate"),
            m("Binary Search Trees Explained",         "Trees",        "https://www.youtube.com/watch?v=pYT9F8_LFTM",  4, "dsa", 15, "intermediate"),
            m("Graphs, BFS & DFS Explained",           "Graphs",       "https://www.youtube.com/watch?v=tWVWeAqZ0WU",  5, "dsa", 20, "advanced"),
            m("Hash Tables & Hashing Explained",       "Hashing",      "https://www.youtube.com/watch?v=KyUTuwz_b7Q",  6, "dsa", 8,  "intermediate"),

            // ── Cloud Computing modules ────────────────────────────────────
            m("Cloud Computing in 6 Minutes",          "Cloud Models", "https://www.youtube.com/watch?v=M988_fsOSWo",  1, "cloud", 6,  "beginner"),
            m("AWS S3 in 100 Seconds",                 "AWS",          "https://www.youtube.com/watch?v=_I14_sXHO8U",  2, "cloud", 2,  "beginner"),
            m("Docker in 100 Seconds",                 "Containers",   "https://www.youtube.com/watch?v=Gjnup-PuquQ",  3, "cloud", 2,  "intermediate"),
            m("Kubernetes in 100 Seconds",             "Containers",   "https://www.youtube.com/watch?v=PziYflu8cB8",  4, "cloud", 2,  "intermediate"),
            m("CDN & Cloud Scalability Explained",     "Scalability",  "https://www.youtube.com/watch?v=RI9np1LWzqw",  5, "cloud", 8,  "advanced"),

            // ── Cybersecurity modules ──────────────────────────────────────
            m("How Firewalls Work",                    "Network Security",   "https://www.youtube.com/watch?v=kDEX1HXybrU", 1, "cybersec", 9,  "beginner"),
            m("SQL Injection Attack Explained",        "Web Security",       "https://www.youtube.com/watch?v=ciNHn38EyRc", 2, "cybersec", 10, "intermediate"),
            m("How HTTPS & TLS Encryption Works",      "Encryption",         "https://www.youtube.com/watch?v=T4Df5_cojAs", 3, "cybersec", 14, "intermediate"),
            m("Social Engineering & Phishing Attacks", "Social Engineering", "https://www.youtube.com/watch?v=YZ-qMnFBugI", 4, "cybersec", 7,  "beginner"),
            m("Zero-Day Vulnerabilities Intro",        "Vulnerabilities",    "https://www.youtube.com/watch?v=3Kq1MIfTWCE", 5, "cybersec", 12, "advanced"),

            // ── Data Science modules ───────────────────────────────────────
            m("Python for Data Science — Getting Started", "Python",           "https://www.youtube.com/watch?v=LHBE6Q9XlzI", 1, "datascience", 30, "beginner"),
            m("Pandas DataFrames in 10 Minutes",           "Python",           "https://www.youtube.com/watch?v=vmEHCJofslg",  2, "datascience", 10, "beginner"),
            m("Exploratory Data Analysis (EDA) Walkthrough","Data Analysis",   "https://www.youtube.com/watch?v=xi0vhXFPegw",  3, "datascience", 20, "intermediate"),
            m("Matplotlib & Seaborn Crash Course",         "Visualization",    "https://www.youtube.com/watch?v=UO98lJQ3QGI",  4, "datascience", 15, "intermediate"),
            m("Feature Engineering & Normalization",       "Data Preprocessing","https://www.youtube.com/watch?v=0xVqLJe9_CY", 5, "datascience", 18, "intermediate"),
            m("Statistics for Data Science",               "Statistics",       "https://www.youtube.com/watch?v=xxpc-HPKN28",  6, "datascience", 25, "advanced")
        ));
    }

    // ─── HELPERS ──────────────────────────────────────────────────────────────

    private Question q(String text, List<String> options, String answer, String concept, String domain) {
        Question q = new Question();
        q.setQuestion(text);
        q.setOptions(options);
        q.setCorrectAnswer(answer);
        q.setConcept(concept);
        q.setDomain(domain);
        return q;
    }

    private Module m(String title, String concept, String videoUrl, int orderIndex, String domain,
                     int durationMinutes, String difficulty) {
        Module mod = new Module();
        mod.setTitle(title);
        mod.setConcept(concept);
        mod.setVideoUrl(videoUrl);
        mod.setOrderIndex(orderIndex);
        mod.setDomain(domain);
        mod.setDurationMinutes(durationMinutes);
        mod.setDifficulty(difficulty);
        return mod;
    }

    private List<String> list(String... items) {
        return Arrays.asList(items);
    }
}
