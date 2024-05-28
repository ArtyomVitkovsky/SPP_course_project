import { jsPDF, AcroFormTextField } from "jspdf";
import autoTable from 'jspdf-autotable';
import { PDFDocument } from "pdf-lib";

export const generateProjectContractDocument = (signature, projectData = {},) => {

    const documentProcessor = new DocumentProcessor({
        page: {
            orientation: "p",
            unit: "pt",
            format: "letter"
        },
        margins: {
            right: 10
        }
    });

    documentProcessor.addText(new Date().toISOString().split('T')[0], 20);
    documentProcessor.addText(
        `${projectData?.client?.companyName} represented by ${projectData?.client?.clientUser.firstName} ${projectData?.client?.clientUser.lastName} on the one hand, hereinafter referred to as the "Client" and BiteDevelopment on the other hand, hereinafter referred to as the "Contractor" have concluded an agreement as follows`,
        60
    );
    documentProcessor.addText(
        `The Contractor agrees to provide employees to perform the "${projectData?.name}" project development work with ${projectData?.manager?.employeeUser.firstName} ${projectData?.manager?.employeeUser.lastName} in "Project Manager" role. Employees performing development duties are presented in the following table`,
        60
    );

    const header = [['Employee name', 'Employee email']]

    const body = [];

    projectData?.employees?.forEach((employee) => {
        body.push([`${employee.employeeUser.firstName} ${employee.employeeUser.lastName}`, employee.employeeUser.email])
    });

    documentProcessor.addTable(60, body, header);
    documentProcessor.addText(`Delivery Date: ${new Date().toISOString().split('T')[0]}`, 30);
    documentProcessor.addText('Sincerely,', 30);
    documentProcessor.addText(`Name: ${projectData?.client?.clientUser?.firstName} ${projectData?.client?.clientUser?.lastName}`, 20);

    if (signature) {
        documentProcessor.addImage(
            signature,
            documentProcessor.width - 170,
            documentProcessor.currentY - 50,
            100,
            80
        );
    }
    documentProcessor.addLine(
        documentProcessor.width - 200,
        documentProcessor.currentY,
        documentProcessor.width - 50,
        documentProcessor.currentY
    );

    documentProcessor.addText('To:', 60);
    documentProcessor.addText('Name: BiteDevelopment', 20);

    documentProcessor.addLine(
        documentProcessor.width - 200,
        documentProcessor.currentY,
        documentProcessor.width - 50,
        documentProcessor.currentY
    );

    documentProcessor.addTextField(documentProcessor.width - 170, documentProcessor.currentY - 60, 100, 80);

    return documentProcessor.getFile(`document${Date.now()}.pdf`);
};

export const getStringFromFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};

export const getFileFromString = async (string, name) => {
    const blob = base64ToBlob(string);
    return new File([blob], name);
};


const base64ToBlob = (base64) => {
    if (!base64) return null;

    const binaryString = atob(base64.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return new Blob([uint8Array]);
};

export const signDocumentByReceiver = async (currentDocument, signUrl) => {
    const base64File = await getStringFromFile(currentDocument);
    const document = await PDFDocument.load(base64File);

    const signature = await document.embedPng(signUrl);
    document.getForm().getTextField('recevier_sign').setImage(signature);

    const file = await document.save();
    const blob = new Blob([new Uint8Array(file)], { type: 'application/pdf' });
    return new File([blob], `document${Date.now()}.pdf`);
};

class DocumentProcessor {
    #documentPdf = new jsPDF();
    #rightMargin;
    #currentY;
    #width;
    #height;

    constructor(params = {
        page: {
            orientation: "p",
            unit: "pt",
            format: "letter",
        },
        margins: {
            right: 10
        }
    }) {
        this.createDocument(params.page);

        this.#rightMargin = params.margins.right;
        this.#currentY = 0;
        this.#height = this.#documentPdf?.internal.pageSize.getHeight();
        this.#width = this.#documentPdf?.internal.pageSize.getWidth();
    }

    get rightMargin() {
        return this.#rightMargin;
    }
    get currentY() {
        return this.#currentY;
    }
    get height() {
        return this.#height;
    }
    get width() {
        return this.#width;
    }

    createDocument = (params = {
        orientation: "p",
        unit: "pt",
        format: "letter"
    }) => {
        const document = new jsPDF(params);
        document.setFontSize(12);
        document.setPage(1);
        this.#documentPdf = document;
    }

    addText = (text, newMargin) => {
        this.#currentY += newMargin;
        if (this.#currentY >= this.#height) {
            this.#documentPdf.addPage('letter');
            const pagesAmount = this.#documentPdf.getNumberOfPages();
            this.#documentPdf.setPage(pagesAmount + 1);
            this.#currentY = newMargin;
        }
        this.#documentPdf.text(
            this.#documentPdf.splitTextToSize(
                text,
                this.#width - this.#rightMargin
            ),
            this.#rightMargin, this.#currentY
        );
    };

    addTable = (topMargin = 0, body = [], header = [[]], lineColor = [0, 0, 0]) => {
        let tableHeight = 0;

        autoTable(this.#documentPdf, {
            theme: 'grid',
            head: header,
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineColor: lineColor,
                lineWidth: 1,
                cellPadding: 2,
                fontSize: 12,
            },
            startY: this.#currentY + topMargin,
            body: body,
            didDrawPage: (data) => {
                tableHeight = data.cursor.y;
            }
        });
        this.#currentY = Math.round(tableHeight);
    };

    addImage = (imageUrl, x, y, w, h) => {
        this.#documentPdf.addImage(imageUrl, x, y, w, h);
    };

    addLine = (x1, y1, x2, y2) => {
        this.#documentPdf.line(x1, y1, x2, y2);
    };

    addTextField = (x, y, w, h) => {
        const textField = new AcroFormTextField();
        textField.fieldName = 'recevier_sign';
        textField.defaultValue = 'signature';
        textField.value = 'signature';
        textField.fontSize = 12;
        textField.height = h;
        textField.width = w;
        textField.x = x;
        textField.y = y;

        this.#documentPdf.setDrawColor('#FFFFFF');
        this.#documentPdf.rect(textField.x, textField.y, textField.width, textField.height, 'S');
        this.#documentPdf.addField(textField);
    };

    getFile = (fileName) => {
        return new File([this.#documentPdf.output('blob')], fileName);
    };
}