import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from('todos').select();

  return (
    <main className="min-h-screen bg-white p-8 font-sans text-gray-900">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h1 className="text-xl font-bold">Supabase Todos Test</h1>
          <Link href="/" className="text-xs text-blue-600 hover:underline">
            ← Back to Brand My Mac
          </Link>
        </div>

        {error ? (
          <div className="p-4 bg-amber-50 text-amber-900 rounded-xl text-xs mb-4 border border-amber-200">
            <strong>Notice:</strong> {error.message}
            <p className="mt-1 text-amber-700">
              Run <code className="bg-amber-100 px-1 py-0.5 rounded">supabase_schema.sql</code> in your Supabase SQL Editor to create this table.
            </p>
          </div>
        ) : null}

        <ul className="space-y-2">
          {todos && todos.length > 0 ? (
            todos.map((todo: { id: number; name: string }) => (
              <li
                key={todo.id}
                className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {todo.name}
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-400 italic py-4 text-center">
              No todos found. Run the schema script to insert test rows!
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}
