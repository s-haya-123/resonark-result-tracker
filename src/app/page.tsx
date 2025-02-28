import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Home() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>スコア</TableHead>
            <TableHead>tRate</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  );
}
