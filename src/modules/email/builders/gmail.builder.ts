export class GmailMessageBuilder {
    private from?: string;
    private to?: string;
    private subject?: string;
    private html?: string;
    private text?: string;

    static create() {
        return new GmailMessageBuilder();
    }

    setFrom(from: string) {
        this.from = from;
        return this;
    }

    setTo(to: string) {
        this.to = to;
        return this;
    }

    setSubject(subject: string) {
        this.subject = subject;
        return this;
    }

    setHtml(html?: string) {
        if(!html) return this;
        this.html = html;
        return this;
    }

    setText(text?: string) {
        if(!text) return this;
        this.text = text;
        return this;
    }

    build(): string {
        if (!this.from || !this.to || !this.subject) {
            throw new Error("Missing required email fields");
        }

        const contentType = this.html
            ? "text/html; charset=utf-8"
            : "text/plain; charset=utf-8";

        const body = this.html || this.text || "";

        const message = [
            `From: ${this.from}`,
            `To: ${this.to}`,
            `Subject: ${this.subject}`,
            `Content-Type: ${contentType}`,
            "",
            body,
        ].join("\n");

        return Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }
}
