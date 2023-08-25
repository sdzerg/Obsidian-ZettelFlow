import { HexString, TFile } from "obsidian";
import { CanvasDataInfo, CanvasEdgeDataInfo } from "obsidian/canvas";
import { FrontmatterService } from "./FrontmatterService";
import { CanvasFileTree } from "../model/CanvasModel";
import { RGB2String, hex2RGB } from "architecture";

export class CanvasService {
    public static getCanvasFileTree(data: CanvasDataInfo): CanvasFileTree[] {
        const nodeFiles = Array.from(data.nodes.values()).filter(node => node.file);
        const edges = Array.from(data.edges.values()).filter(edge => edge.from.node.file && edge.to.node.file);
        const rootFiles = nodeFiles.filter(node => FrontmatterService.instance(node.file).equals("zettelFlowSettings.root", true));
        const canvasFileTree: CanvasFileTree[] = [];

        for (const node of rootFiles) {
            canvasFileTree.push({
                file: node.file,
                color: getCanvasColor(node.color),
                children: CanvasService.getCanvasFileTreeRecursive(node.file, edges)
            });
        }
        // TODO: Handle circular references
        return canvasFileTree;
    }

    private static getCanvasFileTreeRecursive(from: TFile, edges: CanvasEdgeDataInfo[]): CanvasFileTree[] {
        const children: CanvasFileTree[] = [];
        const childrenEdges = edges.filter(edge => edge.from.node.file?.path === from.path);
        for (const edge of childrenEdges) {
            const to = edge.to.node.file;
            if (to) {
                children.push({
                    file: to,
                    color: getCanvasColor(edge.to.node.color),
                    children: CanvasService.getCanvasFileTreeRecursive(to, edges)
                });
            }
        }
        return children;
    }
}

function getCanvasColor(color: HexString) {
    return !color
        ? "var(--embed-background)"
        : color.length === 1
            ? `var(--canvas-color-${color})`
            : RGB2String(hex2RGB(color.substring(1)))
}