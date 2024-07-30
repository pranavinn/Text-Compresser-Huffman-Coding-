function compressText() {
    const inputText = document.getElementById("input-text").value;
    const compressedData = huffmanCompress(inputText);
    document.getElementById("output-text").value = compressedData.compressedBits;
    document.getElementById("huffman-codes").value = JSON.stringify(compressedData.huffmanCodes);
}

function decompressText() {
    const compressedBits = document.getElementById("output-text").value;
    const huffmanCodes = JSON.parse(document.getElementById("huffman-codes").value);
    const compressedData = JSON.stringify({ compressedBits, huffmanCodes });
    const decompressedText = huffmanDecompress(compressedData);
    document.getElementById("decompressed-text").value = decompressedText;
}

function resetFields() {
    document.getElementById("input-text").value = "";
    document.getElementById("output-text").value = "";
    document.getElementById("decompressed-text").value = "";
    document.getElementById("huffman-codes").value = "";
}

class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

function buildHuffmanTree(text) {
    const freqMap = {};
    for (const char of text) {
        freqMap[char] = (freqMap[char] || 0) + 1;
    }

    const pq = Object.entries(freqMap).map(([char, freq]) => new HuffmanNode(char, freq));
    pq.sort((a, b) => a.freq - b.freq);

    while (pq.length > 1) {
        const left = pq.shift();
        const right = pq.shift();
        const newNode = new HuffmanNode(null, left.freq + right.freq, left, right);
        pq.push(newNode);
        pq.sort((a, b) => a.freq - b.freq);
    }

    return pq[0];
}

function buildHuffmanCodes(node, code = "", codes = {}) {
    if (!node.left && !node.right) {
        codes[node.char] = code;
        return codes;
    }
    if (node.left) buildHuffmanCodes(node.left, code + "0", codes);
    if (node.right) buildHuffmanCodes(node.right, code + "1", codes);
    return codes;
}

function huffmanCompress(text) {
    if (text.length === 0) return { compressedBits: "", huffmanCodes: {} };

    const huffmanTree = buildHuffmanTree(text);
    const huffmanCodes = buildHuffmanCodes(huffmanTree);
    const compressedBits = text.split("").map(char => huffmanCodes[char]).join("");

    return { compressedBits, huffmanCodes };
}

function huffmanDecompress(compressed) {
    const { compressedBits, huffmanCodes } = JSON.parse(compressed);
    const invertedHuffmanCodes = Object.fromEntries(Object.entries(huffmanCodes).map(([char, code]) => [code, char]));
    let decompressedText = "";
    let code = "";

    for (const bit of compressedBits) {
        code += bit;
        if (invertedHuffmanCodes[code]) {
            decompressedText += invertedHuffmanCodes[code];
            code = "";
        }
    }

    return decompressedText;
}
