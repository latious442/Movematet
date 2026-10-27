import { NextResponse } from 'next/server';
import { sql } from '../../lib/db';

export async function GET() {
  try {
    const users = await sql`
      SELECT id, name, created_at
      FROM users
      ORDER BY id
    `;

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON' },
      { status: 400 },
    );
  }

  if (typeof body?.name !== 'string' || !body.name.trim()) {
    return NextResponse.json(
      { error: 'Name is required' },
      { status: 400 },
    );
  }

  try {
    const [user] = await sql`
      INSERT INTO users (name)
      VALUES (${body.name.trim()})
      RETURNING id, name, created_at
    `;

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 },
    );
  }
}
