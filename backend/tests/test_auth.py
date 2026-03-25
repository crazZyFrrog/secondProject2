def test_login_after_register(client):
    r = client.post(
        "/auth/register",
        json={"email": "u1@example.com", "password": "secret12"},
    )
    assert r.status_code == 200
    token = r.json()["access_token"]
    assert token

    r2 = client.post(
        "/auth/login",
        json={"email": "u1@example.com", "password": "secret12"},
    )
    assert r2.status_code == 200
    assert r2.json()["access_token"]
