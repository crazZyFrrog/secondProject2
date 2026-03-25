def test_create_project(client):
    reg = client.post(
        "/auth/register",
        json={"email": "p1@example.com", "password": "secret12"},
    )
    token = reg.json()["access_token"]
    r = client.post(
        "/projects",
        json={"name": "Landing"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == "Landing"
    assert "blocks" in data["content"]
