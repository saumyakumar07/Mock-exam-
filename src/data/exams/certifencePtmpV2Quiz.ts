import { ExamSet } from "@/types/exam";

/**
 * CERTIFENCE PTMP v2 — Comprehensive 50-Question MCQ Quiz.
 *
 * Questions and options transcribed verbatim from
 * Question/PTMP_v2_50_Question_Quiz.pdf; correct answers and explanations
 * taken from the answer key at the end of the same PDF.
 *
 * `subject` is the PDF's module heading (questions keep the PDF's order), so
 * the subject tabs and the result page's subject-wise breakdown follow the
 * training modules. The PDF only labels the set "Easy to Medium" overall;
 * per-question `difficulty` is our own judgement and is not shown to
 * candidates.
 */
const certifencePtmpV2Quiz: ExamSet = {
  id: "certifence-ptmp-v2-quiz",
  title: "PTMP v2 — Comprehensive Quiz",
  description:
    "50 questions covering every PTMP v2 module: Linux, Windows & PowerShell, Scripting, OSINT, Scanning & Enumeration, Vulnerability Assessment, Initial Access, Privilege Escalation & Lateral Movement, Post Exploitation, Reporting, Network, Active Directory, API and Web Pentesting.",
  markingScheme: { correct: 1, incorrect: 0.25 },
  questions: [
    // ── Linux for Pentesters ──────────────────────────────────────────────
    {
      id: "ptmp-q1",
      subject: "Linux for Pentesters",
      topic: "Process Management",
      difficulty: "Easy",
      text: "Which command is used to view currently running processes on a Linux system?",
      options: ["ls", "ps", "cat", "grep"],
      correctAnswerIndex: 1,
      explanation:
        "ps lists currently running processes; ls lists files, cat prints file contents, grep searches text.",
    },
    {
      id: "ptmp-q2",
      subject: "Linux for Pentesters",
      topic: "User Accounts",
      difficulty: "Easy",
      text: "Which file stores Linux user account information (username, UID, home directory, shell)?",
      options: ["/etc/shadow", "/etc/passwd", "/etc/hosts", "/etc/group"],
      correctAnswerIndex: 1,
      explanation:
        "/etc/passwd holds account metadata; the actual password hashes live in /etc/shadow.",
    },
    {
      id: "ptmp-q3",
      subject: "Linux for Pentesters",
      topic: "File Permissions",
      difficulty: "Easy",
      text: "Which command changes file permissions in Linux?",
      options: ["chown", "chmod", "chgrp", "umask"],
      correctAnswerIndex: 1,
      explanation: "chmod changes permissions; chown changes the owner, chgrp changes the group.",
    },

    // ── Windows Internals & PowerShell ────────────────────────────────────
    {
      id: "ptmp-q4",
      subject: "Windows Internals & PowerShell",
      topic: "PowerShell Cmdlets",
      difficulty: "Easy",
      text: "Which PowerShell cmdlet lists currently running processes?",
      options: ["Get-Service", "Get-Process", "Get-Item", "Get-Content"],
      correctAnswerIndex: 1,
      explanation: "Get-Process returns running processes; Get-Service lists services instead.",
    },
    {
      id: "ptmp-q5",
      subject: "Windows Internals & PowerShell",
      topic: "Windows Authentication",
      difficulty: "Medium",
      text: "Which Windows component is primarily responsible for authenticating users and enforcing local security policy?",
      options: ["LSASS", "Explorer.exe", "Task Scheduler", "Winlogon"],
      correctAnswerIndex: 0,
      explanation:
        "LSASS (Local Security Authority Subsystem Service) handles authentication and holds credential material in memory.",
    },
    {
      id: "ptmp-q6",
      subject: "Windows Internals & PowerShell",
      topic: "Execution Policy",
      difficulty: "Medium",
      text: 'What does the PowerShell execution policy "Bypass" do?',
      options: [
        "Blocks all scripts from running",
        "Requires every script to be digitally signed",
        "Allows scripts to run with no restrictions or warnings",
        "Only logs script execution without running it",
      ],
      correctAnswerIndex: 2,
      explanation:
        "Bypass removes execution restrictions entirely — nothing is blocked or warned about.",
    },

    // ── Scripting & Automation ────────────────────────────────────────────
    {
      id: "ptmp-q7",
      subject: "Scripting & Automation",
      topic: "Scripting Languages",
      difficulty: "Easy",
      text: "Which scripting language is most commonly used to automate pentesting tasks?",
      options: ["Python", "HTML", "CSS", "SQL"],
      correctAnswerIndex: 0,
      explanation:
        "Python's libraries and simple syntax make it the standard choice for pentest tooling and automation.",
    },
    {
      id: "ptmp-q8",
      subject: "Scripting & Automation",
      topic: "Bash Redirection",
      difficulty: "Easy",
      text: "In Bash, which operator redirects a command's output to a file, overwriting any existing content?",
      options: ["|", ">", "<", "&&"],
      correctAnswerIndex: 1,
      explanation:
        "> overwrites the target file with output; >> would append instead, and | pipes to another command.",
    },
    {
      id: "ptmp-q9",
      subject: "Scripting & Automation",
      topic: "Automation Benefits",
      difficulty: "Easy",
      text: "What is the main benefit of automating repetitive pentesting tasks with scripts?",
      options: [
        "It increases manual effort",
        "It reduces consistency across tests",
        "It saves time and reduces human error",
        "It removes the need for any documentation",
      ],
      correctAnswerIndex: 2,
      explanation:
        "Automation makes repeated tasks faster and more consistent — it doesn't replace documentation.",
    },

    // ── Information Gathering & OSINT ─────────────────────────────────────
    {
      id: "ptmp-q10",
      subject: "Information Gathering & OSINT",
      topic: "Reconnaissance Types",
      difficulty: "Easy",
      text: "Which technique gathers information about a target without directly interacting with its systems?",
      options: [
        "Active reconnaissance",
        "Passive reconnaissance",
        "Exploitation",
        "Post-exploitation",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Passive reconnaissance uses public sources rather than touching the target directly.",
    },
    {
      id: "ptmp-q11",
      subject: "Information Gathering & OSINT",
      topic: "Subdomain Enumeration",
      difficulty: "Easy",
      text: "Which tool is commonly used to discover subdomains during OSINT?",
      options: ["Nmap", "Sublist3r", "Metasploit", "Wireshark"],
      correctAnswerIndex: 1,
      explanation:
        "Sublist3r is built specifically for subdomain enumeration; the others serve different purposes.",
    },
    {
      id: "ptmp-q12",
      subject: "Information Gathering & OSINT",
      topic: "WHOIS",
      difficulty: "Easy",
      text: "A WHOIS lookup is primarily used to gather what kind of information?",
      options: [
        "Open ports on a server",
        "Domain registration details",
        "Running processes",
        "Database schema",
      ],
      correctAnswerIndex: 1,
      explanation:
        "WHOIS returns domain registration records: registrant, registrar, and nameserver details.",
    },
    {
      id: "ptmp-q13",
      subject: "Information Gathering & OSINT",
      topic: "OSINT Sources",
      difficulty: "Easy",
      text: "Which of the following is a typical OSINT source?",
      options: [
        "Internal network diagrams",
        "Public social media profiles",
        "Private source code repositories",
        "Internal employee passwords",
      ],
      correctAnswerIndex: 1,
      explanation:
        "OSINT relies on publicly available information such as social media, not private internal data.",
    },

    // ── Scanning, Enumeration and Vulnerability Assessment ────────────────
    {
      id: "ptmp-q14",
      subject: "Scanning, Enumeration and Vulnerability Assessment",
      topic: "Port Scanning",
      difficulty: "Easy",
      text: "Which tool is most commonly used for network port scanning?",
      options: ["Nikto", "Nmap", "Burp Suite", "John the Ripper"],
      correctAnswerIndex: 1,
      explanation: "Nmap is the standard tool for host discovery and port scanning.",
    },
    {
      id: "ptmp-q15",
      subject: "Scanning, Enumeration and Vulnerability Assessment",
      topic: "SYN Scan",
      difficulty: "Medium",
      text: "A SYN scan (Nmap's -sS) is designed to avoid doing what, compared to a full connect scan?",
      options: [
        "Detecting open ports",
        "Completing the full TCP three-way handshake",
        "Service version detection",
        "DNS resolution",
      ],
      correctAnswerIndex: 1,
      explanation:
        "A SYN scan sends only the initial SYN and never completes the handshake, making it stealthier.",
    },
    {
      id: "ptmp-q16",
      subject: "Scanning, Enumeration and Vulnerability Assessment",
      topic: "Banner Grabbing",
      difficulty: "Easy",
      text: "Banner grabbing is used to determine what?",
      options: [
        "The physical location of a server",
        "The service and version running on a port",
        "The firewall rules in place",
        "The administrator's password",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Banner grabbing reads the service's response to identify what software and version is running.",
    },
    {
      id: "ptmp-q17",
      subject: "Scanning, Enumeration and Vulnerability Assessment",
      topic: "Enumeration",
      difficulty: "Medium",
      text: "What is the main goal of the enumeration phase in a pentest?",
      options: [
        "Writing the final report",
        "Gathering detailed information about identified services, shares, and users",
        "Cleaning up log files",
        "Negotiating scope with the client",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Enumeration digs deeper into what scanning found — users, shares, versions — before exploitation.",
    },

    // ── Vulnerability Assessment & Risk Rating ────────────────────────────
    {
      id: "ptmp-q18",
      subject: "Vulnerability Assessment & Risk Rating",
      topic: "CVSS",
      difficulty: "Easy",
      text: "CVSS (Common Vulnerability Scoring System) is used to:",
      options: [
        "Encrypt vulnerability data",
        "Score the severity of a vulnerability",
        "Patch systems automatically",
        "Generate exploit code",
      ],
      correctAnswerIndex: 1,
      explanation: "CVSS produces a standardized numeric severity score for a vulnerability.",
    },
    {
      id: "ptmp-q19",
      subject: "Vulnerability Assessment & Risk Rating",
      topic: "CVSS Severity Ranges",
      difficulty: "Medium",
      text: 'A vulnerability rated "Critical" typically falls within which CVSS score range?',
      options: ["0.1 - 3.9", "4.0 - 6.9", "7.0 - 8.9", "9.0 - 10.0"],
      correctAnswerIndex: 3,
      explanation:
        "CVSS v3 maps 9.0-10.0 to Critical, 7.0-8.9 to High, 4.0-6.9 to Medium, and 0.1-3.9 to Low.",
    },
    {
      id: "ptmp-q20",
      subject: "Vulnerability Assessment & Risk Rating",
      topic: "Risk Rating Factors",
      difficulty: "Easy",
      text: "Which of the following is NOT typically a factor in a vulnerability's risk rating?",
      options: [
        "Likelihood of exploitation",
        "Business impact",
        "The tester's personal opinion",
        "Exploitability",
      ],
      correctAnswerIndex: 2,
      explanation:
        "Risk ratings are based on structured criteria like impact and exploitability, not personal opinion.",
    },

    // ── Initial Access and Exploitation ───────────────────────────────────
    {
      id: "ptmp-q21",
      subject: "Initial Access and Exploitation",
      topic: "Initial Access",
      difficulty: "Easy",
      text: "What is the primary goal of the initial access phase in a pentest?",
      options: [
        "Writing the report",
        "Gaining an initial foothold into the target environment",
        "Cleaning up all traces",
        "Scanning for open ports",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Initial access is about turning an identified vulnerability into an actual foothold.",
    },
    {
      id: "ptmp-q22",
      subject: "Initial Access and Exploitation",
      topic: "Access Vectors",
      difficulty: "Easy",
      text: "Which of the following is a common initial access vector?",
      options: [
        "A phishing email with a malicious attachment",
        "Reading public documentation",
        "Running a port scan",
        "Writing the executive summary",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Phishing remains one of the most common ways attackers first get into an environment.",
    },
    {
      id: "ptmp-q23",
      subject: "Initial Access and Exploitation",
      topic: "Exploits",
      difficulty: "Easy",
      text: "A piece of code that achieves remote code execution against a vulnerable service is an example of:",
      options: [
        "Passive reconnaissance",
        "An exploit",
        "A compliance checklist",
        "A risk rating",
      ],
      correctAnswerIndex: 1,
      explanation:
        "An exploit is the code or technique that takes advantage of a specific vulnerability.",
    },
    {
      id: "ptmp-q24",
      subject: "Initial Access and Exploitation",
      topic: "Metasploit",
      difficulty: "Easy",
      text: "Metasploit is primarily used for:",
      options: [
        "Writing reports",
        "Developing and executing exploits",
        "Taking screenshots",
        "Managing user accounts",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Metasploit is an exploitation framework for developing, testing, and running exploits.",
    },

    // ── Privilege Escalation and Lateral Movement ─────────────────────────
    {
      id: "ptmp-q25",
      subject: "Privilege Escalation and Lateral Movement",
      topic: "Privilege Escalation",
      difficulty: "Easy",
      text: "Privilege escalation refers to:",
      options: [
        "Reducing an account's access level",
        "Gaining higher-level permissions than originally granted",
        "Resetting a password",
        "Logging out of a session",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Privilege escalation means obtaining more access than the compromised account originally had.",
    },
    {
      id: "ptmp-q26",
      subject: "Privilege Escalation and Lateral Movement",
      topic: "Horizontal Escalation",
      difficulty: "Medium",
      text: "Which of the following is an example of horizontal privilege escalation?",
      options: [
        "A regular user becoming a domain administrator",
        "One regular user accessing another regular user's data at the same privilege level",
        "An admin account losing access",
        "A guest account being disabled",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Horizontal escalation moves sideways between accounts of the same privilege level, not upward.",
    },
    {
      id: "ptmp-q27",
      subject: "Privilege Escalation and Lateral Movement",
      topic: "Pass-the-Hash",
      difficulty: "Medium",
      text: "Pass-the-Hash is a technique used to:",
      options: [
        "Crack a password offline",
        "Authenticate using a password's hash without knowing the plaintext",
        "Encrypt network traffic",
        "Generate a vulnerability report",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Pass-the-Hash reuses a captured password hash directly for authentication, skipping the need to crack it.",
    },
    {
      id: "ptmp-q28",
      subject: "Privilege Escalation and Lateral Movement",
      topic: "Lateral Movement",
      difficulty: "Easy",
      text: "Lateral movement refers to:",
      options: [
        "Moving from one compromised host to other systems within the network",
        "Moving data to an external cloud backup",
        "Changing physical server racks",
        "Updating firewall rules",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Lateral movement is spreading access across a network from an initial compromised host.",
    },

    // ── Post Exploitation ─────────────────────────────────────────────────
    {
      id: "ptmp-q29",
      subject: "Post Exploitation",
      topic: "Persistence",
      difficulty: "Easy",
      text: "Which of the following is a common post-exploitation goal?",
      options: [
        "Establishing persistence on the compromised system",
        "Running the initial port scan",
        "Signing the engagement contract",
        "Setting up the test lab",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Post-exploitation includes maintaining access (persistence) once a foothold is gained.",
    },
    {
      id: "ptmp-q30",
      subject: "Post Exploitation",
      topic: "Data Exfiltration",
      difficulty: "Easy",
      text: "Data exfiltration during post-exploitation refers to:",
      options: [
        "Deleting all data on the target",
        "Extracting sensitive data from the compromised environment",
        "Installing antivirus software",
        "Patching vulnerabilities",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Exfiltration demonstrates impact by actually pulling sensitive data out, under agreed rules of engagement.",
    },
    {
      id: "ptmp-q31",
      subject: "Post Exploitation",
      topic: "Cleanup",
      difficulty: "Medium",
      text: "Why do pentesters clean up or restore artifacts after post-exploitation, within agreed engagement rules?",
      options: [
        "To hide the test from the client entirely",
        "To avoid leaving artifacts that could be mistaken for a real breach",
        "To delete the final report",
        "To permanently disable the client's SOC",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Cleanup prevents confusion for defenders later and restores systems to their pre-test state.",
    },

    // ── Reporting ─────────────────────────────────────────────────────────
    {
      id: "ptmp-q32",
      subject: "Reporting",
      topic: "Report Contents",
      difficulty: "Easy",
      text: "A good pentest report should primarily include:",
      options: [
        "Only a list of tools used",
        "Findings, risk ratings, evidence, and remediation guidance",
        "The tester's personal opinions on the client",
        "Marketing material about the testing company",
      ],
      correctAnswerIndex: 1,
      explanation:
        "A pentest report's core value is documented findings with evidence and clear remediation steps.",
    },
    {
      id: "ptmp-q33",
      subject: "Reporting",
      topic: "Executive Summary",
      difficulty: "Easy",
      text: "An executive summary in a pentest report is written mainly for:",
      options: [
        "Technical engineers only",
        "Non-technical stakeholders and decision-makers",
        "Automated scanning tools",
        "Search engines",
      ],
      correctAnswerIndex: 1,
      explanation:
        "The executive summary translates technical risk into business terms for leadership.",
    },
    {
      id: "ptmp-q34",
      subject: "Reporting",
      topic: "Evidence",
      difficulty: "Easy",
      text: "Why is evidence (screenshots, logs, command output) important in a pentest report?",
      options: [
        "It's optional and rarely included",
        "It proves and supports each finding",
        "It replaces the need for a risk rating",
        "It is only needed for low-severity findings",
      ],
      correctAnswerIndex: 1,
      explanation: "Evidence makes findings verifiable and defensible rather than just asserted.",
    },

    // ── Network Penetration Testing ───────────────────────────────────────
    {
      id: "ptmp-q35",
      subject: "Network Penetration Testing",
      topic: "ARP Spoofing",
      difficulty: "Easy",
      text: "Which protocol is commonly targeted for ARP spoofing attacks?",
      options: ["HTTP", "ARP", "DNS", "SMTP"],
      correctAnswerIndex: 1,
      explanation: "ARP spoofing poisons ARP caches to redirect traffic on a local network segment.",
    },
    {
      id: "ptmp-q36",
      subject: "Network Penetration Testing",
      topic: "SMB Relay",
      difficulty: "Medium",
      text: "SMB relay attacks primarily abuse weaknesses in:",
      options: [
        "Web application input validation",
        "Windows file-sharing authentication",
        "DNS resolution",
        "Email headers",
      ],
      correctAnswerIndex: 1,
      explanation:
        "SMB relay forwards captured NTLM authentication to another host instead of cracking it.",
    },
    {
      id: "ptmp-q37",
      subject: "Network Penetration Testing",
      topic: "Traffic Analysis",
      difficulty: "Easy",
      text: "Which tool is widely used for capturing and analyzing network traffic during a pentest?",
      options: ["Wireshark", "sqlmap", "Hydra", "Burp Suite"],
      correctAnswerIndex: 0,
      explanation: "Wireshark captures and dissects network packets for traffic analysis.",
    },
    {
      id: "ptmp-q38",
      subject: "Network Penetration Testing",
      topic: "VLAN Hopping",
      difficulty: "Medium",
      text: "VLAN hopping attacks aim to:",
      options: [
        "Encrypt network traffic",
        "Access network segments that should be isolated",
        "Reset switch configurations",
        "Patch firewall rules",
      ],
      correctAnswerIndex: 1,
      explanation:
        "VLAN hopping lets an attacker reach traffic on VLANs they shouldn't normally access.",
    },

    // ── Active Directory Pentesting ───────────────────────────────────────
    {
      id: "ptmp-q39",
      subject: "Active Directory Pentesting",
      topic: "Domain Controller",
      difficulty: "Easy",
      text: "In Active Directory, a Domain Controller is primarily responsible for:",
      options: [
        "Hosting the organization's public website",
        "Authenticating users and enforcing security policy",
        "Running end-user applications",
        "Storing print queue data",
      ],
      correctAnswerIndex: 1,
      explanation:
        "The Domain Controller handles authentication (via Kerberos/NTLM) and policy enforcement.",
    },
    {
      id: "ptmp-q40",
      subject: "Active Directory Pentesting",
      topic: "Kerberoasting",
      difficulty: "Medium",
      text: "What does Kerberoasting target?",
      options: [
        "Weak SSH keys",
        "Service account credentials via Kerberos service tickets",
        "Web application cookies",
        "Firewall rules",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Kerberoasting requests service tickets for accounts with an SPN, then cracks them offline for credentials.",
    },
    {
      id: "ptmp-q41",
      subject: "Active Directory Pentesting",
      topic: "Golden Ticket",
      difficulty: "Medium",
      text: "A Golden Ticket attack forges which Kerberos component?",
      options: [
        "The Ticket Granting Ticket (TGT)",
        "The DNS zone file",
        "The Group Policy Object",
        "The DHCP lease",
      ],
      correctAnswerIndex: 0,
      explanation: "A Golden Ticket is a forged TGT built using the compromised krbtgt account's hash.",
    },
    {
      id: "ptmp-q42",
      subject: "Active Directory Pentesting",
      topic: "AD Forest",
      difficulty: "Easy",
      text: "An Active Directory Forest is best described as:",
      options: [
        "A single user account",
        "The top-level container that can hold one or more domain trees",
        "A type of firewall rule",
        "A single physical server",
      ],
      correctAnswerIndex: 1,
      explanation:
        "A forest is the outermost AD boundary, containing one or more trees and domains.",
    },

    // ── API Penetration Testing ───────────────────────────────────────────
    {
      id: "ptmp-q43",
      subject: "API Penetration Testing",
      topic: "BOLA",
      difficulty: "Medium",
      text: "Broken Object Level Authorization (BOLA) occurs when:",
      options: [
        "An API encrypts data incorrectly",
        "An API fails to verify that a requested object belongs to the requesting user",
        "An API has no rate limiting",
        "An API uses SOAP instead of REST",
      ],
      correctAnswerIndex: 1,
      explanation:
        "BOLA happens when an endpoint checks authentication but not ownership of the specific object requested.",
    },
    {
      id: "ptmp-q44",
      subject: "API Penetration Testing",
      topic: "JWT",
      difficulty: "Medium",
      text: "What is the primary purpose of a JWT's signature?",
      options: [
        "To encrypt the payload",
        "To prove the header and payload have not been tampered with",
        "To compress the token",
        "To define the API's rate limit",
      ],
      correctAnswerIndex: 1,
      explanation:
        "The signature verifies integrity — it doesn't encrypt the (readable) header and payload.",
    },
    {
      id: "ptmp-q45",
      subject: "API Penetration Testing",
      topic: "Mass Assignment",
      difficulty: "Medium",
      text: "Mass assignment vulnerabilities typically occur because:",
      options: [
        "The API rejects all input",
        "The API binds an entire request body to a model with no field allowlist",
        "The API uses HTTPS",
        "The API has too many endpoints",
      ],
      correctAnswerIndex: 1,
      explanation:
        'Without an allowlist, extra fields in the request body (like "role") get bound straight to the model.',
    },
    {
      id: "ptmp-q46",
      subject: "API Penetration Testing",
      topic: "SSRF",
      difficulty: "Medium",
      text: "SSRF in an API typically allows an attacker to:",
      options: [
        "Crash the client browser",
        "Make the server send requests to internal or unintended destinations",
        "Change the API's documentation",
        "Bypass CAPTCHA only",
      ],
      correctAnswerIndex: 1,
      explanation:
        "SSRF abuses a server-side URL fetch to reach internal addresses the attacker couldn't reach directly.",
    },

    // ── Web Penetration Testing ───────────────────────────────────────────
    {
      id: "ptmp-q47",
      subject: "Web Penetration Testing",
      topic: "Stored XSS",
      difficulty: "Easy",
      text: "Which of these best describes stored XSS?",
      options: [
        "Malicious script reflected immediately in the response with no storage",
        "Malicious script permanently saved on the server and served to other users",
        "A SQL query that is cached",
        "A CSRF token that is reused",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Stored XSS persists the payload server-side, so it executes for every user who views the affected page.",
    },
    {
      id: "ptmp-q48",
      subject: "Web Penetration Testing",
      topic: "CSRF",
      difficulty: "Medium",
      text: "CSRF attacks primarily exploit:",
      options: [
        "Weak encryption algorithms",
        "The browser automatically attaching session cookies to requests",
        "Outdated TLS certificates",
        "DNS cache poisoning",
      ],
      correctAnswerIndex: 1,
      explanation:
        "CSRF relies on the browser auto-sending the victim's session cookie with a forged cross-site request.",
    },
    {
      id: "ptmp-q49",
      subject: "Web Penetration Testing",
      topic: "Burp Suite",
      difficulty: "Easy",
      text: "In Burp Suite, which tool is used to resend and manually modify a single HTTP request repeatedly?",
      options: ["Intruder", "Repeater", "Decoder", "Comparer"],
      correctAnswerIndex: 1,
      explanation:
        "Repeater is built for sending the same request over and over with manual tweaks between tries.",
    },
    {
      id: "ptmp-q50",
      subject: "Web Penetration Testing",
      topic: "Path Traversal",
      difficulty: "Medium",
      text: "Path traversal attacks commonly use which payload pattern?",
      options: ["' OR '1'='1'", "alert(1)", "../../../../etc/passwd", "; cat /etc/passwd"],
      correctAnswerIndex: 2,
      explanation:
        "../ sequences walk up the directory tree to reach files outside the intended directory.",
    },
  ],
};

export default certifencePtmpV2Quiz;
