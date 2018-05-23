pragma solidity ^0.4.0;

contract ERC20Interface {
    function totalSupply() view public returns (uint256);

    function balanceOf(address _owner) view public returns (uint256);

    function transfer(address _to, uint256 _value) public returns (bool success);

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);

    function approve(address _spender, uint256 _value) public returns (bool success);

    function allowance(address _owner, address _spender) view public returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract CustomToken is ERC20Interface{

    string public _symbol;
    string public _name;
    uint public _decimals;
    uint256 _totalSupply;

    //이 계약의 오너 저장
    address public owner;

    //각각의 계정에 저장된 잔액을 저장
    mapping (address => uint256) balances;

    //계좌 주인에서 다른 계좌로 출금되는지 승인 여부 저장하는 2중 배열형태
    mapping(address => mapping ( address => uint256 )) allowed;

    //주인만 입장하도록 승인하는 함수
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //초기 토큰 생성 부분
    constructor() public{
        //TODO 계정에 초기값 입력
        owner = msg.sender;
    }
    
    function generate(string symbol, string name, uint decimals, uint256 totalSupply) public onlyOwner{
        _symbol = symbol;
        _name = name;
        _decimals = decimals;
        _totalSupply = totalSupply;
        
        balances[msg.sender] = _totalSupply;
    }

    //총 수량 확인 하는 함수
    function totalSupply() view public returns (uint256) {
        return _totalSupply;
    }

    //주인의 계좌의 잔액 조회
    function balanceOf(address _owner) view public returns (uint256) {
        return balances[_owner];
    }

    //_to 에게 금액을 전송하는 함수
    function transfer(address _to, uint256 _amount) public returns (bool success) {
        if(
            //전송자의 잔액이 전송할려는 금액보다 많은지 체크
            balances[msg.sender] >= _amount
            //전송 금액이 0보다 큰지 체크
            && _amount > 0
            //받는(_to) 잔액 + _amount > _to 의 잔액 보다 큰지
            && balances[_to] + _amount > balances[_to]
        ) {
            //잔액을 뺀 금액을 전송자의 잔액에서 제거한다.
            balances[msg.sender] -= _amount;
            //받는 사람의 잔액에 전송금액을 더한다.
            balances[_to] += _amount;
            //transfer 이벤트 발생 처리
            emit Transfer(msg.sender, _to, _amount);

            return true;
        }

        //그리고 성공여부 리턴
        return false;
    }

    //from -> to 토큰을 전송을 하는데 승낙이 있을 경우에만 가능하다.
    function transferFrom(address _from, address _to, uint _amount) public returns (bool success) {
        //TODO from 잔액이 _amount 보다 같거나 큰경우
        //TODO 승인 금액이 _amount보다 같거나 클경우
        //TODO _amount > 0
        //TODO _to의 잔액 + _amount > _to 의 잔액 의 경우
        
        if(
            balances[_from] >= _amount
            && allowed[_from][_to] >= _amount
            && _amount > 0
            && balances[_to] + _amount > balances[_to]
        ) {
            //TODO _from 잔액에 _amount를 뺀다.
            balances[_from] -= _amount;
            //TODO allowed from, msg.sender 로부터 _amount 를 뺀다.
            allowed[_from][_to] -= _amount;
            //TODO _to 잔액에 _amount를 더한다.
            balances[_to] += _amount;
            //TODO Transfer 이벤트를 발생시킨다.
            emit Transfer(_from, _to, _amount);
            return true;
        }

        return false;
    }

    //승인시 이차 배열에 넣고 동작함
    function approve(address _spender, uint256 _amount) public returns (bool success) {
        //함수 호출하는 사람이 _spender 에게 얼마나 줄껀지 정한다.
        allowed[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    //승인 잔액 조회
    function allowance(address _owner, address _spender) view public returns (uint remaining) {
        return allowed[_owner][_spender];
    }


}